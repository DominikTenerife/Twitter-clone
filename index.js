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
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if (e.target.dataset.replybtn) {
        handleSubmitReplyClick(e.target.dataset.replybtn)
    }
    
    else if (e.target.dataset.deletebtn) {
        handleDeleteReplyClick(e.target.dataset.deletebtn)
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
    let reply = document.getElementById(`replies-${replyId}`)
    //console.log(reply)
    reply.classList.toggle('hidden')
    //let submit = document.getElementById(`reply-btn-${replyId}`)
    //console.log(submit)
    
    
}

function handleSubmitReplyClick (replyId) {
    let submit = document.getElementById(`reply-btn-${replyId}`)
    let input = document.getElementById(`reply-input-${replyId}`)
    let replyObject = {
        handle: `@Scrimba`,
                profilePic: `images/scrimbalogo.png`,
                tweetText: `${input.value}`,
        
    }
   
   const targetTweetObj = tweetsData.filter(function(tweet){
       return tweet.uuid === replyId
    })[0]
    
    if (input.value) {
    targetTweetObj.replies.unshift(replyObject)
    }
    
    render()
    handleReplyClick(replyId)
    
}

function handleDeleteReplyClick (replyId) {
    const targetTweetObj = tweetsData.filter(function(tweet){
       return tweet.uuid === replyId
    })[0]
    
    targetTweetObj.replies.shift()
    render()
    handleReplyClick(replyId)
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
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
    <textarea placeholder="Reply to the post" id="reply-input-${tweet.uuid}"></textarea>
    <div class="reply-btns">
    <button class="reply-btn" id="reply-btn-${tweet.uuid}" data-replybtn="${tweet.uuid}">Submit</button>
    <button class="reply-btn" id="delete-btn-${tweet.uuid}" data-deletebtn="${tweet.uuid}" >Delete</button>
    </div>
        ${repliesHtml}
    </div>   
</div>
`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

