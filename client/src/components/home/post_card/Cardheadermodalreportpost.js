import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createReport } from '../../../redux/actions/reportUserAction';
 
const Cardheadermodalreportpost = ({ post, onClose }) => {
    const { auth } = useSelector(state => state);
    const dispatch = useDispatch();
    const [reportReason, setReportReason] = useState("");

    const handleSubmit = () => {
        if (!reportReason) {
            alert("Veuillez sélectionner une raison pour signaler ce post.");
            return;
        }

        // Datos del reporte
        const reportData = {
            postId: post._id,
            userId: post.user._id,  // Usuario al que pertenece el post
            reportedBy: auth.user._id,  // Usuario que realiza el reporte
            reason: reportReason,
        };
        

        // Llama a la acción para crear el reporte
        dispatch(createReport({ auth, reportData }));

        // Cierra el modal
        onClose();
    };

    return (
        <div className="modalbackdrop">
            <div className="modalcontentreport">
                {/* Botón de cierre */}
                <button className="modalclose" onClick={onClose}>
                    &times; {/* Símbolo de "X" */}
                </button>

                <h3 className='ml-1'>Signaler le post</h3>
                <select
                    className="form-control-bloquar"
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    required
                >
                    <option value="">Sélectionner le motif</option>
                    <option value="Comportement abusif">Comportement abusif</option>
                    <option value="Spam">Spam</option>
                    <option value="Violation des conditions d'utilisation">Violation des conditions d'utilisation</option>
                    <option value="Langage offensant">Langage offensant</option>
                    <option value="Fraude">Fraude</option>
                    <option value="Usurpation d'identité">Usurpation d'identité</option>
                    <option value="Contenu inapproprié">Contenu inapproprié</option>
                    <option value="Violation de la vie privée">Violation de la vie privée</option>
                    <option value="Interruption du service">Interruption du service</option>
                    <option value="Activité suspecte">Activité suspecte</option>
                    <option value="Autre">Autre</option>
                </select>
                <div className="button-container">
                    <button
                        onClick={handleSubmit}
                        className="primary"
                    >
                        Envoyer le signalement
                    </button>
                    <button
                        onClick={onClose}
                        className="secondary"
                    >
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cardheadermodalreportpost;