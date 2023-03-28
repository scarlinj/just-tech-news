// make this function asynchronous, since user will make asynchronous PUT request to upvote

async function upvoteClickHandler(event) {
    event.preventDefault();

    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
      ];
  
    console.log(id);
  }
  
  document.querySelector('.upvote-btn').addEventListener('click', upvoteClickHandler);