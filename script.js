$(document).ready(function () {
    $('#processForm').on('submit', function (e) {
        e.preventDefault();

        const mode = $('#modeSelect').val();
        const fileInput = $('input[type="file"]')[0].files[0];

        if (!fileInput) {
            alert("Please select a file.");
            return;
        }

        $('#loadingContainer').show();
        $('#loadingBar').css('width', '0%');
        $('#loadingText').text('0%');

        if (mode === 'encode') {
            const reader = new FileReader();
            reader.onload = function (event) {
                const imageData = event.target.result.split(',')[1]; // Remove base64 header
                $('#loadingContainer').hide();
                $('#statusMessage').text("File encoded successfully.");
                $('#downloadContainer').show();

                $('#downloadButton').click(function () {
                    const blob = new Blob([imageData], { type: 'text/plain' });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = "encoded_base64_H56.txt";
                    link.click();
                });
            };

            reader.onerror = function () {
                $('#loadingContainer').hide();
                $('#statusMessage').text("Error encoding file.");
            };

            reader.readAsDataURL(fileInput);
        } else if (mode === 'decode') {
            const reader = new FileReader();
            reader.onload = function (event) {
                const base64Data = event.target.result.trim();

                try {
                    const binaryData = atob(base64Data); // Decode base64
                    const arrayBuffer = new Uint8Array(binaryData.length);
                    for (let i = 0; i < binaryData.length; i++) {
                        arrayBuffer[i] = binaryData.charCodeAt(i);
                    }

                    $('#loadingContainer').hide();
                    $('#statusMessage').text("File decoded successfully.");
                    $('#downloadContainer').show();

                    $('#downloadButton').click(function () {
                        const blob = new Blob([arrayBuffer], { type: 'image/png' });
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(blob);
                        link.download = "decoded_image_H56.png";
                        link.click();
                    });
                } catch (error) {
                    $('#loadingContainer').hide();
                    $('#statusMessage').text("Error decoding file: " + error.message);
                }
            };

            reader.onerror = function () {
                $('#loadingContainer').hide();
                $('#statusMessage').text("Error reading file.");
            };

            reader.readAsText(fileInput);
        }
    });
});