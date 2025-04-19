import './Confetti.css';
import { useEffect, useRef } from 'react';

function Confetti() {
    const canvasRef = useRef(null);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const confettiCount = 200;
        const confettiColors = ['#ffc107', '#dc3545', '#007bff', '#28a745', '#17a2b8'];
        const confetti = [];
        
        // Create confetti particles
        for (let i = 0; i < confettiCount; i++) {
            confetti.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                size: Math.random() * 10 + 5,
                color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
                speed: Math.random() * 3 + 2,
                angle: Math.random() * 6.28,
                spin: Math.random() < 0.5 ? 0.03 : -0.03
            });
        }
        
        // Animation
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let i = 0; i < confetti.length; i++) {
                const p = confetti[i];
                ctx.beginPath();
                ctx.fillStyle = p.color;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.angle);
                
                // Draw rectangle confetti
                ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
                
                ctx.restore();
                
                // Update position
                p.y += p.speed;
                p.angle += p.spin;
                
                // Reset if out of view
                if (p.y > canvas.height) {
                    p.y = -p.size;
                    p.x = Math.random() * canvas.width;
                }
            }
            
            const animId = requestAnimationFrame(animate);
            
            // Cleanup function to stop animation
            return () => {
                cancelAnimationFrame(animId);
            };
        }
        
        const animationId = requestAnimationFrame(animate);
        
        return () => {
            cancelAnimationFrame(animationId);
        };
    }, []);
    
    return (
        <canvas ref={canvasRef} className="confetti-canvas"></canvas>
    );
}

export default Confetti;
