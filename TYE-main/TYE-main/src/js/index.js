/**
 * TYE Web Application
 * Main application logic for authentication, navigation, and card UI
 */

class CardStack {
  constructor(containerId, type) {
    this.container = document.getElementById(containerId);
    this.type = type; // 'job' or 'social'
    this.cards = [];
    this.activeIndex = 0;

    if (this.container) {
      this.init();
    }
  }

  init() {
    this.loadMockData();
    this.render();
    this.attachControls();
  }

  loadMockData() {
    if (this.type === 'job') {
      this.cards = [
        { title: "Senior Developer", subtitle: "Tech Corp • Remote", image: "💻" },
        { title: "Product Manager", subtitle: "Startup Inc • NY", image: "🚀" },
        { title: "UX Designer", subtitle: "Design Studio • London", image: "🎨" },
        { title: "Data Scientist", subtitle: "AI Lab • SF", image: "🤖" },
        { title: "DevOps Engineer", subtitle: "Cloud Systems • Remote", image: "☁️" },
      ];
    } else {
      this.cards = [
        { title: "Sarah Jenkins", subtitle: "Marketing Specialist", image: "👩‍💼" },
        { title: "David Chen", subtitle: "Software Engineer", image: "👨‍💻" },
        { title: "Maria Garcia", subtitle: "Product Owner", image: "👩‍💻" },
        { title: "James Wilson", subtitle: "Recruiter", image: "👨‍💼" },
        { title: "Emily Davis", subtitle: "Designer", image: "👩‍🎨" },
      ];
    }
  }

  render() {
    this.container.innerHTML = '';

    // Render in reverse order so first item is on top (last child)
    [...this.cards].reverse().forEach((card, index) => {
      const cardEl = document.createElement('div');
      cardEl.className = 'swipe-card';
      cardEl.innerHTML = `
        <div class="card-image">${card.image}</div>
        <div class="card-content">
          <div class="card-title">${card.title}</div>
          <div class="card-subtitle">${card.subtitle}</div>
        </div>
      `;
      this.container.appendChild(cardEl);
    });
  }

  attachControls() {
    const passBtn = document.getElementById('pass-btn');
    const likeBtn = document.getElementById('like-btn');

    if (passBtn) passBtn.addEventListener('click', () => this.swipe('left'));
    if (likeBtn) likeBtn.addEventListener('click', () => this.swipe('right'));
  }

  swipe(direction) {
    const cards = this.container.querySelectorAll('.swipe-card');
    if (cards.length === 0) return;

    const currentCard = cards[cards.length - 1]; // Top card is last child

    // Add animation class
    currentCard.classList.add(direction === 'left' ? 'swipe-left' : 'swipe-right');

    // Remove after animation
    setTimeout(() => {
      currentCard.remove();

      // Check if stack is empty
      if (this.container.children.length === 0) {
        this.showEmptyState();
      }
    }, 300);
  }

  showEmptyState() {
    const emptyMsg = document.createElement('div');
    emptyMsg.className = 'flex-center';
    emptyMsg.style.height = '100%';
    emptyMsg.style.color = 'var(--color-text-muted)';
    emptyMsg.innerHTML = '<h3>No more profiles!</h3>';
    this.container.appendChild(emptyMsg);
  }
}

class TYEApp {
  constructor() {
    this.infoMap = new Map();
    this.setupInfoContent();
    this.setupEventListeners();
    this.checkCardStack();
  }

  /**
   * Check if current page needs a card stack
   */
  checkCardStack() {
    const stackContainer = document.getElementById('card-stack-container');
    if (stackContainer) {
      const type = stackContainer.dataset.type; // 'job' or 'social'
      new CardStack('card-stack-container', type);
    }
  }

  /**
   * Setup informational content
   */
  setupInfoContent() {
    this.infoMap.set(1, ["About Us", "Welcome to TYE - Your comprehensive platform for career development and social networking."]);
    this.infoMap.set(2, ["Our Goal", "To connect professionals with opportunities and foster meaningful career growth."]);
  }

  /**
   * Setup all event listeners
   */
  setupEventListeners() {
    this.setupLoginHandler();
    this.setupNavigationHandlers();
    this.setupInfoHandlers();
  }

  /**
   * Setup login form handler
   */
  setupLoginHandler() {
    const loginButton = document.getElementById("Login");
    const messageElement = document.getElementById("correct");

    if (loginButton && messageElement) {
      loginButton.addEventListener("click", (e) => {
        // Prevent default form submission if it's inside a form
        e.preventDefault();
        this.handleLogin(messageElement);
      });
    }
  }

  /**
   * Handle user login
   */
  handleLogin(messageElement) {
    const usernameEl = document.getElementById("username");
    const passwordEl = document.getElementById("password");

    if (!usernameEl || !passwordEl) return;

    const username = usernameEl.value.trim();
    const password = passwordEl.value.trim();

    if (!username || !password) {
      messageElement.textContent = "Please enter both username and password.";
      return;
    }

    // Mock authentication for demonstration
    // In a real app, this should be an API call
    if (this.authenticateUser(username, password)) {
      // Redirect to home page
      // Adjust path based on current location (files in pages/auth need to go up to pages/home.html)
      // Since we standardized on pages/home.html, and login is in pages/auth/login.html
      // We go up one level to pages/ then to home.html
      window.location.href = "../home.html";
    } else {
      messageElement.textContent = "Invalid credentials. Try 'admin' / 'password'.";
    }
  }

  /**
   * Authenticate user credentials (MOCK)
   */
  authenticateUser(username, password) {
    // Hardcoded mock credentials
    const MOCK_USER = "admin";
    const MOCK_PASS = "password";

    return username === MOCK_USER && password === MOCK_PASS;
  }

  /**
   * Setup navigation button handlers
   */
  setupNavigationHandlers() {
    // Base paths depending on where we are. 
    // This script is imported in home.html (in pages/) and other pages.
    // If we are in pages/home.html:
    //   profile -> auth/profile.html
    //   social -> social/Socialhome.html
    //   job -> job/Jobhome.html
    //   logout -> auth/login.html

    const navigationHandlers = {
      profilebutton: "auth/profile.html",
      Socialbutton: "social/Socialhome.html",
      Jobbutton: "job/Jobhome.html",
      logoutbutton: "auth/login.html"
    };

    Object.entries(navigationHandlers).forEach(([buttonId, targetUrl]) => {
      const button = document.getElementById(buttonId);
      if (button) {
        button.addEventListener("click", () => {
          window.location.href = targetUrl;
        });
      }
    });
  }

  /**
   * Setup information button handlers
   */
  setupInfoHandlers() {
    const infoButtons = document.getElementsByClassName("infobutton");

    if (infoButtons && infoButtons.length) {
      Array.from(infoButtons).forEach((button, index) => {
        // Use data-index if available, else index+1
        const buttonIndex = button.dataset.index ?
          Number(button.dataset.index) : index + 1;

        button.addEventListener("click", () => {
          this.displayInfo(buttonIndex);
        });
      });
    }
  }

  /**
   * Display information content
   */
  displayInfo(index) {
    const infoData = this.infoMap.get(index);
    if (!infoData) return;

    const headingElement = document.getElementById("infoheading");
    const contentElement = document.getElementById("infop");

    if (headingElement) headingElement.textContent = infoData[0];
    if (contentElement) contentElement.textContent = infoData[1];
  }
}

// Initialize the application when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new TYEApp();
});
