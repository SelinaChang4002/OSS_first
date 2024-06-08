document.addEventListener("DOMContentLoaded", function () {
    const guestbookForm = document.getElementById('guestbook-form');
    const guestbookEntries = document.getElementById('guestbook-entries');
    const submitButton = document.getElementById('submitButton');

    guestbookForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const title = document.getElementById('nameInput').value;
        const body = document.getElementById('messageInput').value;

        // 새로운 방명록 만들기
        fetch('/book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, body }),
        })
            .then(response => response.json())
            .then(data => {
                // 방명록 목록을 업데이트합니다.
                fetchBooks();
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        guestbookForm.reset();
    });

    // 방명록을 가져오는 함수
    function fetchBooks() {
        fetch('/books')
            .then(response => response.json())
            .then(data => {
                guestbookEntries.innerHTML = '';
                data.forEach(book => {
                    const entry = document.createElement('div');
                    entry.className = 'guestbook-entry';
                    entry.id = book.id;
                    entry.innerHTML = `<strong>${book.title}</strong><p>${book.date}</p><p>${book.body}</p><button class="delete-button">삭제</button>`; // add delete button here

                    const deleteButton = entry.querySelector('.delete-button');
                    deleteButton.addEventListener('click', () => {
                        fetch(`/book/${book.id}`, {
                            method: 'DELETE',
                        })
                            .then(response => response.json())
                            .then(data => {
                                // After deletion, refresh the book list.
                                fetchBooks();
                            })
                            .catch((error) => {
                                console.error('Error:', error);
                            });
                    });

                    guestbookEntries.appendChild(entry);
                });
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    // 페이지 로드 시 방명록 목록을 가져옵니다.
    fetchBooks();

    // Wrap each character in the .text elements with a span
    const textElements = document.querySelectorAll('.text');
    textElements.forEach(el => {
        el.innerHTML = el.textContent.split('').map(char => `<span>${char}</span>`).join('');
    });

    // 장예은 클릭 이벤트 추가
    const nameElement = document.getElementById('name');
    const birthdayElement = document.getElementById('birthday');

    nameElement.addEventListener('click', function () {
        birthdayElement.classList.toggle('birthday-animate');
        if (birthdayElement.classList.contains('birthday-animate')) {
            startMoving(birthdayElement);
        } else {
            stopMoving(birthdayElement);
        }
    });

    let moveInterval;

    function startMoving(element) {
        moveInterval = setInterval(function () {
            const x = Math.random() * (window.innerWidth - element.offsetWidth);
            const y = Math.random() * (window.innerHeight - element.offsetHeight);
            element.style.transform = `translate(${x}px, ${y}px)`;
        }, 500); // 속도 더 빠르게 조정
    }

    function stopMoving(element) {
        clearInterval(moveInterval);
        element.style.transform = `translate(0, 0)`;
    }

    // 버튼에 마우스를 올렸을 때 텍스트 변경
    submitButton.addEventListener('mouseover', function () {
        submitButton.textContent = '진짜 남겨!';
        submitButton.style.borderRadius = '20px'; // 버튼 모서리 둥글게 변경
    });

    submitButton.addEventListener('mouseout', function () {
        submitButton.textContent = '남기기';
        submitButton.style.borderRadius = '10px'; // 원래대로 돌아가기
    });

    // 하트 커서 추가
    submitButton.style.cursor = "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"24\" viewBox=\"0 96 960 960\" width=\"24\"><path d=\"M480 822.1l-30.1-27.55C293.8 672.65 199.2 588.55 199.2 492.5c0-66.95 48.15-113.2 114.75-113.2 39.65 0 81.65 19.45 104.05 50.25h24.05c22.4-30.8 64.4-50.25 104.05-50.25 66.6 0 114.75 46.25 114.75 113.2 0 96.05-94.6 180.15-250.7 302.05L480 822.1z\"/></svg>') 32 32, auto";
});
