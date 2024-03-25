document.addEventListener("DOMContentLoaded", () => {
  const submitButton = document.querySelector("#taskForm button[type='submit']");
  const clearTasksButton = document.querySelector("#clearTasksBtn");

  submitButton.addEventListener("click", async (event) => {
      event.preventDefault();
      await submitTask();
  });

  clearTasksButton.addEventListener("click", async () => {
      await clearTasks();
  });

  async function submitTask() {
      try {
          const userId = extractIdFromUrl(); 
          const response = await fetch(`/api/users/${userId}/submitTask`, { 
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  userId: userId
              })
          });

          if (response.ok) {
              const completedTasksSpan = document.querySelector("#completedTasks span");
              const taskCount = parseInt(completedTasksSpan.textContent);
              completedTasksSpan.textContent = taskCount + 1;

              const coinCountSpan = document.querySelector("#coinCount span");
              const randomCoinCount = Math.floor(Math.random() * 10) + 1;
              const currentCoinCount = parseInt(coinCountSpan.textContent);
              coinCountSpan.textContent = currentCoinCount + randomCoinCount;

              alert("Task submitted successfully!");
          } else {
              throw new Error('Failed to submit task');
          }
      } catch (error) {
          console.error('Error submitting task:', error);
          alert('Failed to submit task. Please try again later.');
      }
  }

  async function clearTasks() {
      try {
          alert("Tasks cleared successfully!");
      } catch (error) {
          console.error('Error clearing tasks:', error);
          alert('Failed to clear tasks. Please try again later.');
      }
  }

 
  function extractIdFromUrl() {
    const url = window.location.href;
    const urlParts = url.split('/');
    if (urlParts.length >= 4) { 
        return urlParts[3];
    }
    return null; 
}
});
