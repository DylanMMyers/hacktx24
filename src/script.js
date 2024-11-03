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
  
    divider.addEventListener('mousedown', (e) => {
      isDragging = true;
      document.body.style.cursor = 'col-resize';
    });
  
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

    // Function to send a message
    function sendMessage() {
      const chatInput = document.getElementById("chatInput");
      const chatContent = document.getElementById("chatContent");
      const userMessage = chatInput.value.trim();

      if (userMessage) {
        const newBubble = document.createElement("div");
        newBubble.classList.add("chat-bubble", "user-bubble");
        newBubble.textContent = userMessage;
        chatContent.appendChild(newBubble);
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
        const visitLengthSelect = document.getElementById('visitLengthSelect');
        for (let i = 1; i <= 30; i++) {
          const option = document.createElement('option');
          option.value = i;
          option.textContent = i;
          visitLengthSelect.appendChild(option);
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
    
                    // Create and append the delete button
                    const deleteButton = document.createElement("span");
                    deleteButton.textContent = "X";
                    deleteButton.classList.add("delete-button");
    
                    // Add event listener for delete button
                    deleteButton.addEventListener("click", function(event) {
                        event.stopPropagation(); // Prevent event from affecting parent
                        const userConfirmed = confirm("Are you sure you want to delete this conversation?");
                        if (userConfirmed) {
                            chatEntriesContainer.removeChild(savedTitle);
                        }
                    });
    
                    savedTitle.appendChild(deleteButton);
                    chatEntriesContainer.replaceChild(savedTitle, newChatBlock);
                }
            }
        });
    });
    
// REGISTERING NEW USERS
document.querySelector('.popup-submit-register').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    // Send the data to the Python server
    fetch('/register', {
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

    
    
    
      
      
      
      