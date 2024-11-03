require([
    "esri/Map",
    "esri/views/MapView"
  ], function(Map, MapView) {
    const map = new Map({
      basemap: "topo-vector" // Choose a basemap style
    });

    const view = new MapView({
      container: "viewDiv",
      map: map,
      center: [138.2529, 36.2048], // Longitude, latitude of Japan
      zoom: 5 // Initial zoom level
    });
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

// Function to send a message and style it
function sendMessage() {
    const chatInput = document.getElementById("chatInput");
    const chatContent = document.getElementById("chatContent");
    const userMessage = chatInput.value.trim();

    if (userMessage && activeConversation) {
        // Create a new bubble for the user's message
        const newBubble = document.createElement("div");
        newBubble.classList.add("chat-bubble", "user-bubble");
        newBubble.textContent = userMessage;
        chatContent.appendChild(newBubble);

        // Save the message to the active conversation
        conversations[activeConversation].push({ sender: 'user', text: userMessage });

        chatInput.value = ""; // Clear the input field
        chatContent.scrollTop = chatContent.scrollHeight; // Scroll to the bottom
    }
}

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

// Track the current active conversation
let activeConversation = null;

// In-memory storage for conversations
let conversations = {};

// Event listener for creating a new chat
document.getElementById("newChatButton").addEventListener("click", function() {
    const chatEntriesContainer = document.getElementById("chatEntriesContainer");
    const newChatBlock = document.createElement("input");
    newChatBlock.type = "text";
    newChatBlock.placeholder = "Please enter conversation title";
    newChatBlock.classList.add("new-chat-entry");

    // Append the new input field to the chat entries container
    chatEntriesContainer.appendChild(newChatBlock);
    newChatBlock.focus();

    // Event listener for pressing 'Enter' on the new input field
    newChatBlock.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            if (newChatBlock.value.trim() === "") {
                const userChoice = confirm("The conversation title cannot be blank. Click 'OK' to retry or 'Cancel' to delete the conversation.");
                if (userChoice) {
                    newChatBlock.focus(); // Retry
                } else {
                    chatEntriesContainer.removeChild(newChatBlock); // Cancel and delete
                }
            } else {
                // Save the input as static text
                const savedTitle = document.createElement("div");
                savedTitle.textContent = newChatBlock.value;
                savedTitle.classList.add("new-chat-entry");
                savedTitle.style.position = "relative";

                // Set this conversation as active
                activeConversation = newChatBlock.value;
                conversations[activeConversation] = []; // Initialize an empty conversation array

                // Create and append the delete button
                const deleteButton = document.createElement("span");
                deleteButton.textContent = "X";
                deleteButton.classList.add("delete-button");

                // Add event listener for delete button
                deleteButton.addEventListener("click", function(event) {
                    event.stopPropagation(); // Prevent event from affecting parent
                    const userConfirmed = confirm("Are you sure you want to delete this conversation?");
                    if (userConfirmed) {
                        delete conversations[activeConversation]; // Remove from memory
                        chatEntriesContainer.removeChild(savedTitle);
                    }
                });

                // Add event listener for loading conversation when clicked
                savedTitle.addEventListener("click", function() {
                    loadConversation(newChatBlock.value);
                });

                savedTitle.appendChild(deleteButton);
                chatEntriesContainer.replaceChild(savedTitle, newChatBlock);

                // Hide all chat bubbles when a new conversation is created
                document.querySelectorAll('.chat-bubble').forEach(bubble => {
                    bubble.style.display = 'none';
                });

                console.log(`New chat created: ${newChatBlock.value}`);
            }
        }
    });
});

// Function to load a conversation into the chat window
function loadConversation(chatName) {
    const chatContent = document.getElementById("chatContent");
    chatContent.innerHTML = ''; // Clear current chat content
    activeConversation = chatName; // Set the active conversation

    if (conversations[chatName] && conversations[chatName].length > 0) {
        conversations[chatName].forEach(message => {
            const chatBubble = document.createElement("div");
            chatBubble.textContent = message.text;
            chatBubble.classList.add("chat-bubble");
            chatBubble.classList.add(message.sender === 'user' ? 'user-bubble' : 'responder-bubble');
            chatContent.appendChild(chatBubble);
        });
        console.log(`Loaded conversation: ${chatName}`);
    } else {
        console.log(`No content available for conversation: ${chatName}`);
    }
}
    
    
    document.querySelector('.popup-submit-login').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default form submission
    
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
    
        fetch('http://127.0.0.1:5000/login', {  // Ensure this matches the Flask server port
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              username: username,
              password: password
            })
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            console.log('Success:', data);
          })
          .catch((error) => {
            console.error('Error:', error);
          });
    });

    document.querySelector('.popup-submit-register').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default form submission
    
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
    
        fetch('http://127.0.0.1:5000/register', {  // Ensure this matches the Flask server port
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              username: username,
              password: password
            })
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            console.log('Success:', data);
          })
          .catch((error) => {
            console.error('Error:', error);
          });
    });


    
    
    
      
      
      
      