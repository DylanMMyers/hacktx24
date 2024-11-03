require([
  "esri/Map",
  "esri/views/MapView",
  "esri/Graphic",
  "esri/layers/GraphicsLayer"
], function(Map, MapView, Graphic, GraphicsLayer) {
  const map = new Map({
    basemap: "topo-vector" // Choose a basemap style
  });

  const graphicsLayer = new GraphicsLayer();
  map.add(graphicsLayer);

  const view = new MapView({
    container: "viewDiv",
    map: map,
    center: [138.2529, 36.2048], // Longitude, latitude of Japan
    zoom: 5 // Initial zoom level
  });

  // Make view globally accessible
  window.mapView = view;
  
  // Add the addPin function
  window.addPin = function(longitude, latitude, title, shouldCenter = false) {
    // Create a point
    const point = {
      type: "point",
      longitude: longitude,
      latitude: latitude
    };

    // Create a symbol for rendering the point
    const markerSymbol = {
      type: "simple-marker",
      color: [226, 119, 40], // Orange
      outline: {
        color: [255, 255, 255], // White
        width: 2
      }
    };

    // Create a graphic with popup template
    const pointGraphic = new Graphic({
      geometry: point,
      symbol: markerSymbol,
      attributes: {
        title: title
      },
      popupTemplate: {
        title: title
      }
    });

    graphicsLayer.add(pointGraphic);

    // Only center the map if specifically requested
    if (shouldCenter) {
      view.goTo({
        center: [longitude, latitude],
        zoom: 12
      });
    }
  };
});

function handleClick(button) {
  const buttons = document.querySelectorAll('.button');
  buttons.forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');
}

document.getElementById('sign-in-button').addEventListener('click', function() {
  showPopup('loginPopup');
});

document.getElementById('register-button').addEventListener('click', function() {
  showPopup('registerPopup');
});

function showPopup(popupId) {
  document.getElementById(popupId).style.display = 'block';
}

function closePopup(popupId) {
  document.getElementById(popupId).style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
  const divider = document.getElementById('dividerBetweenSections');
  const contentGrid = document.getElementById('contentGrid');

  let isDragging = false;

  window.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const newWidth = e.clientX;
      // Adjust the grid template columns to resize the panels
      contentGrid.style.gridTemplateColumns = `${newWidth}px auto 1fr`;
    }
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      document.body.style.cursor = 'default';
    }
  });
});

// Event listener for the send button
document.getElementById("sendButton").addEventListener("click", sendMessage);

// Event listener for pressing 'Enter' in the text input
document.getElementById("chatInput").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent default 'Enter' key behavior
    sendMessage();
  }
});

// Toggle the display of the dropdown menu when the profile icon is clicked
document.querySelector('.profile-icon').addEventListener('click', function() {
  const dropdown = document.getElementById('profileDropdown');
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
});

// Close the dropdown if clicked outside
window.addEventListener('click', function(event) {
  if (!event.target.matches('.profile-icon')) {
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown.style.display === 'block') {
      dropdown.style.display = 'none';
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const numberGrid = document.getElementById('numberGrid');
  const submitButton = document.getElementById('submitButton');
  const warningMessage = document.getElementById('warningMessage');
  let selectedNumber = null;

  // Create 30 number boxes
  for (let i = 1; i <= 30; i++) {
    const numberBox = document.createElement('div');
    numberBox.classList.add('number-box');
    numberBox.textContent = i;
    numberBox.addEventListener('click', () => {
      // Remove the 'selected' class from any previously selected box
      document.querySelectorAll('.number-box').forEach(box => box.classList.remove('selected'));
      // Mark this box as selected
      numberBox.classList.add('selected');
      selectedNumber = i;
    });
    numberGrid.appendChild(numberBox);
  }

  submitButton.addEventListener('click', () => {
    if (!selectedNumber) {
      warningMessage.style.display = 'block';
    } else {
      warningMessage.style.display = 'none';
      alert(`Preferences submitted successfully! Selected number: ${selectedNumber}`);
      // Add any further actions here
    }
  });
});

const resizeHandle = document.getElementById('resizeHandle');
const chatPane = document.getElementById('chat');
let isResizing = false;

resizeHandle.addEventListener('mousedown', (e) => {
  isResizing = true;
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', () => {
    isResizing = false;
    document.removeEventListener('mousemove', onMouseMove);
  });
});

function onMouseMove(e) {
  if (isResizing) {
    const newHeight = window.innerHeight - e.clientY;
    chatPane.style.height = `${newHeight}px`;
  }
}

window.addEventListener('resize', function() {
  if (window.innerWidth <= 768) { // Match the media query max-width
    const chatSection = document.getElementById('chat');
    if (chatSection) {
      chatSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
});

document.getElementById("newChatButton").addEventListener("click", function() {
  currentConversationId = null; // Reset conversation ID
  const chatContent = document.getElementById("chatContent");
  chatContent.innerHTML = ''; // Clear chat content
  
  // Add initial greeting
  const greetingBubble = document.createElement("div");
  greetingBubble.classList.add("chat-bubble", "responder-bubble");
  greetingBubble.textContent = "Hello! How can I help you plan your trip to Japan?";
  chatContent.appendChild(greetingBubble);
});

// REGISTERING NEW USERS
document.querySelector('.popup-submit-register').addEventListener('click', function(event) {
  event.preventDefault(); // Prevent the default form submission

  const username = document.getElementById('registerUsername').value;
  const password = document.getElementById('registerPassword').value;

  // Send the data to the Python server
  fetch('http://10.146.103.162/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username: username, password: password })
  })
  .then(response => response.json())
  .then(data => {
    console.log(data); // Log the entire JSON response
    alert(data.message); // Show a message to the user
  })
  .catch(error => {
    console.error('Error:', error);
    alert('There was an error with registration.');
  });
});

let currentConversationId = null;

async function sendMessage() {
  console.log("Sending message...");
  const chatInput = document.getElementById("chatInput");
  const chatContent = document.getElementById("chatContent");
  const userMessage = chatInput.value.trim();

  if (!userMessage) return;

  // Create and append user message bubble
  const userBubble = document.createElement("div");
  userBubble.classList.add("chat-bubble", "user-bubble");
  userBubble.textContent = userMessage;
  chatContent.appendChild(userBubble);

  // Clear input field
  chatInput.value = "";

  try {
    // Get selected preferences
    const selectedBudget = document.querySelector('.button.active')?.textContent || '$';
    const selectedDays = document.querySelector('.number-box.selected')?.textContent || '1';

    const response = await fetch('http://127.0.0.1:5001/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: userMessage,
        conversation_id: currentConversationId,
        preferences: {
          budget: selectedBudget,
          days: selectedDays
        }
      })
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    
    // Store the conversation ID if it's a new conversation
    if (!currentConversationId) {
      currentConversationId = data.conversation_id;
    }
    
    // Create and append AI response bubble
    const aiBubble = document.createElement("div");
    aiBubble.classList.add("chat-bubble", "responder-bubble");
    aiBubble.textContent = data.response;
    // chatContent.appendChild(aiBubble);
    await parseResponse(data.response);
    chatContent.appendChild(aiBubble);

  } catch (error) {
    console.error('Error:', error);
    // Create error message bubble
    const errorBubble = document.createElement("div");
    errorBubble.classList.add("chat-bubble", "responder-bubble", "error");
    errorBubble.textContent = "Sorry, I encountered an error while processing your request.";
    chatContent.appendChild(errorBubble);
  }

  // Scroll to bottom of chat
  chatContent.scrollTop = chatContent.scrollHeight;
}

// Event listeners for the send button and Enter key
document.getElementById("sendButton").addEventListener("click", sendMessage);
document.getElementById("chatInput").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessage();
  }
});

async function parseResponse(response) {
  const response2 = await fetch('http://127.0.0.1:5001/parse', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: response
    })
  });
  const data = await response2.json();
  console.log(data);
  if (data.locations) {
    data.locations.forEach((location, index) => {
      // Swap the coordinates order since they come as [lat, lon] but we need [lon, lat]
      const longitude = location.coordinates[1];  // Get longitude from second position
      const latitude = location.coordinates[0];   // Get latitude from first position
      const shouldCenter = index === 0;
      addPin(longitude, latitude, location.location, shouldCenter);
    });
  }
}


