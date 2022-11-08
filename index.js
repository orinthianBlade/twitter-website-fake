import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';


document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.dataset.replysend){
        console.log("HI")
        handleReplySendClick(e.target.dataset.replysend)
    }
    else if(e.target.dataset.deleteTweet){
        handleDeleteTweetClick(e.target.dataset.deleteTweet)
    }
 
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleReplySendClick(tweetId){
    const replyTextbox = document.getElementById(`reply-textarea-${tweetId}`)
    console.log("CLICK")
    let reply = {
                handle: `@Mohammed ✅`,
                profilePic: `images/scrimbalogo.png`,
                tweetText: replyTextbox.value,
    }
    
    tweetsData.filter(x => x.uuid === tweetId)[0].replies.unshift(reply)
    render()
}

function handleDeleteTweetClick(tweetId){
    tweetsData.splice(tweetsData.findIndex(x => x.uuid === tweetId), 1)
    render()
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }

}

function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
                ${tweet.handle === `@Scrimba` ? `<span class="tweet-detail">
                    <i class="fa-regular fa-trash-can"
                    data-delete-tweet="${tweet.uuid}"></i>
                </span>` : ""}
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        <div class="reply-div">
            <img src="images/scrimbalogo.png" class="profile-pic reply-pic">
            <textarea placeholder="Reply" class="tweet-reply-textarea" 
            id="reply-textarea-${tweet.uuid}"></textarea>
            <i class="fa-solid fa-share tweet-reply-btn" data-replySend="${tweet.uuid}"></i>            
        </div>
        ${repliesHtml}
    </div>   
</div>
`
   })
   
   
   return feedHtml 
}

function render(){
    localStorage.setItem('tweetsData', JSON.stringify(tweetsData))
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

