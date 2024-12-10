export default function getCroppedImg(imageSrc, croppedAreaPixels) {
    return new Promise((res, rej) => {
        const image = new Image();
        image.src = imageSrc;
        image.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            
            canvas.width = croppedAreaPixels.width;
            canvas.height = croppedAreaPixels.height;
            
            ctx.drawImage(
            
                image,
                croppedAreaPixels.x,
                croppedAreaPixels.y,
                croppedAreaPixels.width,
                croppedAreaPixels.height,
                0,
                0,
                croppedAreaPixels.width,
                croppedAreaPixels.height,
            );
            
            const base64Image = canvas.toDataURL('image/jpeg', 1); // 1 for maximum quality
            res(base64Image);
        };
        image.onerror = (error) => {
            rej(error);
        };
    });
}