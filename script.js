document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const setupSection = document.querySelector('.setup-section');
    const timerSection = document.querySelector('.timer-section');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    
    const titleInput = document.getElementById('title');
    const hoursInput = document.getElementById('hours');
    const minutesInput = document.getElementById('minutes');
    const secondsInput = document.getElementById('seconds');
    
    const timerTitle = document.getElementById('timer-title');
    const hoursDisplay = document.getElementById('hours-display');
    const minutesDisplay = document.getElementById('minutes-display');
    const secondsDisplay = document.getElementById('seconds-display');
    
    // Add CSS for expired timer
    const style = document.createElement('style');
    style.textContent = `
        .timer-expired {
            color: #e74c3c !important;
        }
        .expired-message {
            color: #e74c3c;
            font-size: 1.5rem;
            margin-top: 1rem;
        }
    `;
    document.head.appendChild(style);
    
    let countdown;
    let remainingTime = 0;
    let isPaused = false;
    let isExpired = false;
    let expiredTime = 0;
    
    // Format time to always show two digits (e.g., 01, 02, etc.)
    const formatTime = (time) => {
        return time < 10 ? `0${time}` : time;
    };
    
    // Calculate total seconds from hours, minutes, seconds inputs
    const calculateTotalSeconds = () => {
        const hours = parseInt(hoursInput.value) || 0;
        const minutes = parseInt(minutesInput.value) || 0;
        const seconds = parseInt(secondsInput.value) || 0;
        
        return hours * 3600 + minutes * 60 + seconds;
    };
    
    // Update the timer display
    const updateTimerDisplay = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        hoursDisplay.textContent = formatTime(hours);
        minutesDisplay.textContent = formatTime(minutes);
        secondsDisplay.textContent = formatTime(seconds);
    };
    
    // Start the countdown
    const startTimer = () => {
        // Get the title/description
        const title = titleInput.value.trim();
        
        // Set title or hide it if empty
        if (title) {
            timerTitle.textContent = title;
	}
        timerTitle.style.display = 'block';
        
        // Handle contenteditable title updates
        timerTitle.addEventListener('input', () => {
            const currentTitle = timerTitle.textContent.trim();
            // Update document title if timer is running
            if (!timerSection.classList.contains('hidden')) {
                const timeDisplay = document.title.split(' - ')[0];
                if (currentTitle) {
                    document.title = `${timeDisplay} - ${currentTitle}`;
                } else {
                    document.title = timeDisplay;
                }
            }
	    titleInput.value = currentTitle;
        });
        
        // Calculate total seconds
        remainingTime = calculateTotalSeconds();
        
        // Validate input
        if (remainingTime <= 0) {
            alert('Please enter a valid time.');
            return;
        }
        
        // Hide setup section, show timer section
        setupSection.classList.add('hidden');
        timerSection.classList.remove('hidden');
        
        // Update display immediately
        updateTimerDisplay(remainingTime);
        
        // Start countdown
        countdown = setInterval(() => {
            if (remainingTime <= 1) {
                if (!isExpired) {
                    // Timer just expired
            remainingTime--;
            updateTimerDisplay(remainingTime);
                    isExpired = true;
                    expiredTime = 0;
                    
                    // Add expired message
                    const expiredMsg = document.createElement('div');
                    expiredMsg.className = 'expired-message';
                    expiredMsg.textContent = 'Time has expired!';
                    timerSection.insertBefore(expiredMsg, document.querySelector('.timer-controls'));
                    
                    // Change timer display color to red
                    document.querySelector('.timer-display').classList.add('timer-expired');
                    
                    // Update title
                    const currentTitle = timerTitle.textContent.trim();
                    const displayTitle = currentTitle && currentTitle !== 'Click to edit title' ? ` - ${currentTitle}` : '';
                    document.title = `EXPIRED${displayTitle}`;
                } else {
                    // Count up after expiration
                    expiredTime++;
                    const hours = Math.floor(expiredTime / 3600);
                    const minutes = Math.floor((expiredTime % 3600) / 60);
                    const seconds = expiredTime % 60;
                    
                    // Add "+" prefix to hours
                    hoursDisplay.textContent = "+" + formatTime(hours);
                    minutesDisplay.textContent = formatTime(minutes);
                    secondsDisplay.textContent = formatTime(seconds);
                    
                    // Update page title
                    const currentTitle = timerTitle.textContent.trim();
                    const displayTitle = currentTitle && currentTitle !== 'Click to edit title' ? ` - ${currentTitle}` : '';
                    document.title = `+${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}${displayTitle}`;
                }
                return;
            }
            
            remainingTime--;
            updateTimerDisplay(remainingTime);
            
            // Update page title to show remaining time
            const currentTitle = timerTitle.textContent.trim();
            const displayTitle = currentTitle && currentTitle !== 'Click to edit title' ? ` - ${currentTitle}` : '';
            document.title = `${formatTime(Math.floor(remainingTime / 3600))}:${formatTime(Math.floor((remainingTime % 3600) / 60))}:${formatTime(remainingTime % 60)}${displayTitle}`;
        }, 1000);
    };
    
    // Pause/Resume the timer
    const togglePause = () => {
        if (isPaused) {
            // Resume
            countdown = setInterval(() => {
                if (remainingTime <= 0) {
                    if (!isExpired) {
                        // Timer just expired
                        isExpired = true;
                        expiredTime = 0;
                        
                        // Add expired message
                        const expiredMsg = document.createElement('div');
                        expiredMsg.className = 'expired-message';
                        expiredMsg.textContent = 'Time has expired!';
                        timerSection.insertBefore(expiredMsg, document.querySelector('.timer-controls'));
                        
                        // Change timer display color to red
                        document.querySelector('.timer-display').classList.add('timer-expired');
                        
                        // Get current title text or empty string
                        const currentTitle = timerTitle.textContent.trim();
                        const displayTitle = currentTitle && currentTitle !== 'Click to edit title' ? ` - ${currentTitle}` : '';
                        
                        // Update title
                        document.title = `EXPIRED${displayTitle}`;
                    } else {
                        // Count up after expiration
                        expiredTime++;
                        const hours = Math.floor(expiredTime / 3600);
                        const minutes = Math.floor((expiredTime % 3600) / 60);
                        const seconds = expiredTime % 60;
                        
                        // Add "+" prefix to hours
                        hoursDisplay.textContent = "+" + formatTime(hours);
                        minutesDisplay.textContent = formatTime(minutes);
                        secondsDisplay.textContent = formatTime(seconds);
                        
                        // Get current title text or empty string
                        const currentTitle = timerTitle.textContent.trim();
                        const displayTitle = currentTitle && currentTitle !== 'Click to edit title' ? ` - ${currentTitle}` : '';
                        
                        // Update page title
                        document.title = `+${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}${displayTitle}`;
                    }
                    return;
                }
                
                remainingTime--;
                updateTimerDisplay(remainingTime);
            }, 1000);
            
            pauseBtn.textContent = 'Pause';
            pauseBtn.classList.remove('paused');
        } else {
            // Pause
            clearInterval(countdown);
            pauseBtn.textContent = 'Resume';
            pauseBtn.classList.add('paused');
        }
        
        isPaused = !isPaused;
    };
    
    // Reset the timer
    const resetTimer = () => {
        // Clear the interval
        clearInterval(countdown);
        
        // Reset pause state
        isPaused = false;
        pauseBtn.textContent = 'Pause';
        pauseBtn.classList.remove('paused');
        
        // Reset expired state
        isExpired = false;
        expiredTime = 0;
        
        // Remove expired message if it exists
        const expiredMsg = document.querySelector('.expired-message');
        if (expiredMsg) {
            expiredMsg.remove();
        }
        
        // Remove expired styling
        document.querySelector('.timer-display').classList.remove('timer-expired');
        
        // Show setup section, hide timer section
        setupSection.classList.remove('hidden');
        timerSection.classList.add('hidden');
        
        // Reset page title
        document.title = 'Countdown Timer';
    };
    
    // Event listeners
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', togglePause);
    resetBtn.addEventListener('click', resetTimer);

    // Input validation for number fields
    [hoursInput, minutesInput, secondsInput].forEach(input => {
        input.addEventListener('input', () => {
            let value = parseInt(input.value) || 0;
            
            if (input === hoursInput) {
                if (value > 99) value = 99;
            } else {
                if (value > 59) value = 59;
            }
            
            if (value < 0) value = 0;
            
            input.value = value;
        });
    });

    // Ensure timer title is visible by default (will be hidden if empty when timer starts)
    timerTitle.style.display = 'block';
    
    // Handle initial click on the title to clear the placeholder text
    timerTitle.addEventListener('focus', function handleFirstClick() {
        if (this.textContent.trim() === 'Click to edit title') {
            this.textContent = '';
        }
    });
});
