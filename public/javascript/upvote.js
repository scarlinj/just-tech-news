// make this function asynchronous, since user will make asynchronous PUT request to upvote

async function upvoteClickHandler(event) {
    event.preventDefault();
  // Split the URL string into an array based on the / character, then grab the last item in the array, which is the id of the post
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
      ];
  
    console.log(id);
  }
  
  document.querySelector('.upvote-btn').addEventListener('click', upvoteClickHandler);