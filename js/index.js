document.addEventListener("DOMContentLoaded", function() {
    const listPanel = document.getElementById('list-panel')
    const information = document.getElementById('show-panel')
    const baseURL = 'http://localhost:3000'


    const renderBooks = (data) => {
        
        let ul = document.createElement('ul')
        for (let i in data) {
            let book = data[i]

            let listItem = document.createElement('li')
            
            listItem.textContent = book.title
            
            ul.appendChild(listItem)

            listItem.addEventListener('click', (e) => {
                information.innerHTML = ''
                moreInfo(book)
            })
        }
        listPanel.appendChild(ul)
    }
    const moreInfo = (book) => {
        console.log(book)
        let thumbnail = document.createElement('img')
        let title = document.createElement('h2')
        let author = document.createElement('h3')
        let desc = document.createElement('p')
        let userContainer = document.createElement('ul')
        let likeButton = document.createElement('button')
        let liked = false
        
        for (let i in book.users) {
            let users = document.createElement('li')
            users.textContent = book.users[i].username
            if (book.users[i].username === 'pouros') {liked = true}
            userContainer.appendChild(users)
        }
        
       
        thumbnail.src = book.img_url
        title.textContent = book.title
        author.textContent = book.author
        desc.textContent = book.description;
        (liked) ? likeButton.textContent = 'UNLIKE' : likeButton.textContent = 'LIKE';


        information.appendChild(thumbnail)
        information.appendChild(title)
        information.appendChild(author)
        information.appendChild(desc)
        information.appendChild(userContainer)
        information.appendChild(likeButton)
        
        let userArray = book.users.filter((elem) => {
            return elem != null && elem != '';
        })
        
        likeButton.addEventListener('click', (e) => {
           
            let newLike = {
                id: 1,
                username: "pouros"
            }
            if (liked) {
                for(let i in userArray) {
                    if (userArray[i].username === 'pouros') {
                        userArray.splice(i, 1)
                        delete book.users[i]
                    }
                
                }
                
                deleteLike(book, newLike)
                
            } else {
                
                userArray.push(newLike)
                console.log(userArray)
                addLike(book, userArray)
                likeButton.innerHTML = 'UNLIKE'
            }

        })

    }
    const fetchBooks = () => {
        
        fetch(`${baseURL}/books`)
        .then(response => response.json())
        .then(data => renderBooks(data))
        .catch(error => console.log(error))
    }


    const deleteLike = (book, newLike) => {
        fetch(`${baseURL}/books/${book.id}`,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(book)
        })
        .then(response => response.json())
        .then(data => {
            
            listPanel.innerHTML = ''
            information.innerHTML = ''
            fetchBooks()
            moreInfo(book)
        })
        .catch(error => console.log(error))
    }


    const addLike = (book, userArray) => {
        fetch(`${baseURL}/books/${book.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'applcation/json'
            },
            body: JSON.stringify({
                users: userArray
            })
        })
        .then(response => response.json())
        .then(data => {
            
            listPanel.innerHTML = ''
            information.innerHTML = ''
            fetchBooks()
            console.log('secondTime', data)
            moreInfo(data)
        })
        .catch(error => console.log(error))
    }
fetchBooks()
});
