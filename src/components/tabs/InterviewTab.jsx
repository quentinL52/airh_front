import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { interviewService } from '../../services/interviewService';
import { jobsService } from '../../services/jobService';
import recruteurPng from '../../assets/recruteur.png';
import '../../style/InterviewTab.css';
import CustomJobModal from './CustomJobModal';

const InterviewTab = ({ jobId }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);
    const [hasStarted, setHasStarted] = useState(false);
    const [interviewId, setInterviewId] = useState(null);
    const [isFinished, setIsFinished] = useState(false);

    // Cheat detection state
    const [pasteMetrics, setPasteMetrics] = useState({
        pasteCount: 0,
        totalPastedChars: 0,
        totalTypedChars: 0
    });

    const { getToken } = useAuth();

    // Beta features state
    const [customJobDescription, setCustomJobDescription] = useState({});
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [jobTitle, setJobTitle] = useState('');
    const [showHelp, setShowHelp] = useState(false);

    const lastJobIdRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (jobId) {
            jobsService.getJob(jobId).then(job => {
                setJobTitle(job.poste);
            }).catch(err => console.error("Error fetching job details:", err));
        } else if (customJobDescription.poste) {
            setJobTitle(customJobDescription.poste);
        }
    }, [jobId, customJobDescription.poste]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading, isFinished]);

    // Detect end of interview based on message content
    useEffect(() => {
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.role === 'assistant' && lastMessage.content.includes("L'entretien est maintenant terminé")) {
                if (!isFinished) {
                    setIsFinished(true);
                }
            }
        }
    }, [messages, isFinished]);

    useEffect(() => {
        const initInterview = async () => {
            if (jobId && jobId !== lastJobIdRef.current) {
                lastJobIdRef.current = jobId;

                try {
                    setIsLoading(true);
                    const token = await getToken();

                    // Check status to see if we should resume
                    const statusData = await interviewService.getStatus(jobId, token);

                    if (statusData.status === 'exists' && !statusData.is_finished && statusData.conversation && statusData.conversation.length > 0) {
                        // Resume logic
                        setMessages(statusData.conversation);
                        setInterviewId(statusData.interview_id);
                        setHasStarted(true);
                        setIsFinished(statusData.is_finished || false);
                    } else {
                        // Start new logic
                        await startInterview(token);
                    }
                } catch (e) {
                    console.error("Error checking status:", e);
                    // Fallback to trying to start new if check fails (e.g. 404 handled in service?)
                    // The service throws if !ok. If status 500, maybe error.
                    // If "none", getStatus returns {status: "none"} (success).
                    // So catch likely means server error or network.
                    // Let's try starting new anyway as fallback? Or show error?
                    // Safe to try start.
                    const token = await getToken(); // Ensure token needed
                    await startInterview(token);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        initInterview();
    }, [jobId]);

    const startInterview = async (token) => {
        // Can optionally pass token to avoid re-getting it
        if (!token) token = await getToken();
        setIsLoading(true);
        setError(null);
        try {
            const response = await interviewService.startInterview(jobId, null, token);
            if (response.messages) {
                setMessages(response.messages);
            }
            if (response.interview_id) {
                setInterviewId(response.interview_id);
            }
            if (response.is_finished !== undefined) {
                setIsFinished(response.is_finished);
            }
            setHasStarted(true);
        } catch (err) {
            setError(err.message);
        }
    };

    // Custom job modal submission handler
    const handleStartCustomInterview = async (data) => {
        // data contains { entreprise, poste, mission, profil_recherche, competences }
        setIsLoading(true);
        setError(null);
        try {
            const token = await getToken();
            const response = await interviewService.startInterview(null, data, token);
            if (response.messages) {
                setMessages(response.messages);
            }
            if (response.interview_id) {
                setInterviewId(response.interview_id);
            }
            if (response.is_finished !== undefined) {
                setIsFinished(response.is_finished);
            }

            // Should also set the custom job description in state if we want to use it for context later?
            // The original logic relied on customJobDescription state for sendMessage.
            // Let's update that state too so sendMessage works correctly.
            setCustomJobDescription(data);

            setHasStarted(true);
            setShowCustomInput(false); // Close modal
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePaste = (e) => {
        const pastedText = e.clipboardData.getData('text');
        setPasteMetrics(prev => ({
            ...prev,
            pasteCount: prev.pasteCount + 1,
            totalPastedChars: prev.totalPastedChars + pastedText.length
        }));
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        // Update total typed chars (approximation including the current message)
        const currentMsgLength = input.length;
        const newTotalTyped = pasteMetrics.totalTypedChars + currentMsgLength; // Accumulate length

        // Calculate current ratio
        const currentMetrics = {
            ...pasteMetrics,
            totalTypedChars: newTotalTyped,
            ratio: newTotalTyped > 0 ? (pasteMetrics.totalPastedChars / newTotalTyped) : 0
        };

        setPasteMetrics(prev => ({ ...prev, totalTypedChars: newTotalTyped }));

        const userMessage = { role: 'user', content: input };
        const newMessages = [...messages, userMessage];

        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            // Pass customJobDescription if we are in custom mode (no jobId)
            // Pass customJobDescription and cheatMetrics
            const token = await getToken();
            const response = await interviewService.sendMessage(
                jobId,
                newMessages,
                jobId ? null : customJobDescription,
                interviewId,
                token,
                currentMetrics // Send cheating metrics
            );
            if (response.messages) {
                setMessages(response.messages);
            }
            if (response.interview_id && !interviewId) {
                setInterviewId(response.interview_id);
            }
            if (response.is_finished !== undefined) {
                setIsFinished(response.is_finished);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleGoToJobs = () => {
        window.location.href = "/home?section=jobs";
    };

    if (!jobId && !hasStarted) {
        return (
            <div className="tab-content">
                <div className="no-job-selected">
                    <h2>Prêt pour votre entretien ?</h2>

                    <div className="explanation-frame">
                        <p>
                            Bienvenue dans votre simulation d'entretien virtuel.
                        </p>
                        <p>
                            Cet outil est pensé pour vous mettre en condition réelle et vous préparer efficacement.
                            L'IA jouera le rôle du recruteur et analysera vos réponses pour vous donner un feedback constructif.
                        </p>
                        <p>
                            Pour démarrer, vous avez le choix : sélectionnez une offre parmi celles disponibles ou configurez une offre personnalisée pour un entraînement sur mesure.
                        </p>
                    </div>

                    <div className="action-buttons">
                        <button className="primary-btn" onClick={() => setShowCustomInput(true)}>
                            Utiliser une offre personnalisée
                        </button>
                        <button className="secondary-btn" onClick={handleGoToJobs}>
                            Voir les offres disponibles
                        </button>
                    </div>
                </div>

                <CustomJobModal
                    isOpen={showCustomInput}
                    onClose={() => setShowCustomInput(false)}
                    onSubmit={handleStartCustomInterview}
                    isLoading={isLoading}
                />
            </div>
        );
    }

    return (
        <div className="tab-content">
            <div className="interview-container">
                <div className="interview-header-redesigned">
                    <div className="header-left">
                        <img src={recruteurPng} alt="Recruteur" className="recruiter-avatar" />
                        <div className="header-info">
                            <span className="header-subtitle">Votre entretien pour le poste de</span>
                            <h2 className="header-title">{jobTitle || 'Poste non défini'}</h2>
                        </div>
                    </div>
                    <button className="help-btn" onClick={() => setShowHelp(true)}>
                        <i className="fas fa-question-circle"></i>
                    </button>
                </div>

                {showHelp && (
                    <div className="help-popup-overlay">
                        <div className="help-popup">
                            <button className="close-help-btn" onClick={() => setShowHelp(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                            <p>
                                Ceci est une mise en situation d'entretien, pensé pour vous évaluer.
                                Roni va passer par plusieurs étapes lors de votre évaluation.
                                Vous pourrez quitter l'entretien à tout moment et revenir plus tard pour le continuer.
                            </p>
                        </div>
                    </div>
                )}

                <div className="chat-window">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.role}`}>
                            {msg.content}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="message assistant">
                            <div className="loading-dots">
                                <div className="dot"></div>
                                <div className="dot"></div>
                                <div className="dot"></div>
                            </div>
                        </div>
                    )}
                    {error && <div className="error-message" style={{ color: 'red', textAlign: 'center' }}>{error}</div>}

                    {isFinished && (
                        <div className="end-interview-container">
                            <div className="end-bubble">
                                Fin de la conversation
                            </div>
                            <div className="guidance-message">
                                <p><strong>Merci ! L'entretien est terminé.</strong></p>
                                <p>L'IA analyse actuellement vos réponses. Le rapport sera disponible dans votre espace personnel sous peu.</p>
                                <p style={{ marginTop: '10px', fontSize: '0.9em', color: '#666' }}>
                                    Vous pouvez maintenant naviguer vers d'autres offres ou consulter votre tableau de bord.
                                </p>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                <div className="input-area">
                    <textarea
                        className="chat-input"
                        placeholder="Écrivez votre réponse..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onPaste={handlePaste}
                        onKeyPress={handleKeyPress}
                        rows="1"
                        disabled={isLoading || isFinished}
                    />
                    <button
                        className="send-btn"
                        onClick={handleSend}
                        disabled={isLoading || !input.trim() || isFinished}
                    >
                        Envoyer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InterviewTab;
