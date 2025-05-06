
        const rankingListElement = document.getElementById('ranking-list');
        const statusElement = document.getElementById('status');
        const refreshButton = document.getElementById('refresh-button');

        // ¡¡IMPORTANTE!! Reemplaza esto con la URL de tu Google Apps Script
        const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxlbM5uB618y76L-MVGqn69Jujt8L3ZsTZe0wOwMuc6EpfYJzgPGz2-BpmeBXHCFdtR/exec";

        async function fetchRanking() {
            statusElement.textContent = "Cargando ranking...";
            rankingListElement.innerHTML = ''; // Limpiar lista anterior

            try {
                const response = await fetch(SCRIPT_URL);

                if (!response.ok) {
                    // Manejar errores HTTP (4xx, 5xx)
                    throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
                }

                const rankingData = await response.json(); // Parsea la respuesta como JSON

                if (rankingData && Array.isArray(rankingData)) {
                    if (rankingData.length === 0) {
                        statusElement.textContent = "El ranking está vacío.";
                    } else {
                        displayRanking(rankingData);
                        statusElement.textContent = "Ranking cargado.";
                    }
                } else if (rankingData && rankingData.error) {
                    // Si el Apps Script devolvió un JSON de error propio
                    throw new Error(`Error del script: ${rankingData.error}`);
                }
                 else {
                    throw new Error("Respuesta inválida o no es un array JSON.");
                }

            } catch (error) {
                console.error("Error al obtener el ranking:", error);
                statusElement.textContent = `Error al cargar: ${error.message}`;
            }
        }

        function displayRanking(data) {
            data.forEach((entry, index) => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <span>${index + 1}.</span>
                    <span class="rank-name">${escapeHtml(entry.name)}</span>
                    <span class="rank-score">${entry.score}</span>
                `;
                rankingListElement.appendChild(listItem);
            });
        }

        // Función simple para escapar HTML y prevenir XSS básico
        function escapeHtml(unsafe) {
            if (typeof unsafe !== 'string') {
                return unsafe; // Devolver como está si no es string (ej. score)
            }
            return unsafe
                 .replace(/&/g, "&")
                 .replace(/</g, "<")
                 .replace(/>/g, ">")
                 .replace(/"/g, "")
                 .replace(/'/g, "'");
        }

        // Cargar el ranking cuando la página carga
        document.addEventListener('DOMContentLoaded', fetchRanking);

        // Event listener para el botón de actualizar
        if (refreshButton) {
            refreshButton.addEventListener('click', fetchRanking);
        }

        // Opcional: Actualizar automáticamente cada X segundos
        // setInterval(fetchRanking, 30000); // Actualiza cada 30 segundos (30000 ms)
