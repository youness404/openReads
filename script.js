const overlay = document.querySelector(".overlay");
const button = document.querySelector(".find-book");
const modalBox = document.getElementById("modal-box");
const searchBookBtn = document.querySelector("#search-book-btn");

// Open overlay
button.addEventListener("click", () => {
  overlay.classList.remove("hidden", "opacity-0");
  overlay.classList.add("opacity-100");
  // clear previous results
  document.querySelector(".books-container").innerHTML = "";
});

// Close overlay when clicking outside modal
overlay.addEventListener("click", () => {
  overlay.classList.add("opacity-0");
  setTimeout(() => overlay.classList.add("hidden"), 500); // fade out
});

// Prevent overlay from closing when clicking inside modal
modalBox.addEventListener("click", (e) => e.stopPropagation());

searchBookBtn.addEventListener("click", () => {
  overlay.classList.add("opacity-0");
  overlay.classList.add("hidden");
  fetchBook();
  document.getElementById("query").value = "";
});

// Enter key event listener
document.getElementById("query").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent form submission
    searchBookBtn.click(); // Trigger the search button click
  }
});

//function to fetch the book based on the given query
const fetchBook = function () {
  const query = document.getElementById("query");
  if (!query.value.trim()) return; // Don't search if query is empty

  const url = `https://openlibrary.org/search.json?q=${query.value}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const limitedBooksTo20 = data.docs.slice(0, 20);

      const booksContainer = document.querySelector(".books-container");
      booksContainer.innerHTML = ""; // clear old results

      limitedBooksTo20.forEach((el) => {
        const author = el.author_name ? el.author_name[0] : "Unknown Author";
        const bookTitle = el.title ? el.title : "Unknown Title";
        const bookCover = el.cover_i
          ? `https://covers.openlibrary.org/b/id/${el.cover_i}-M.jpg`
          : "./public/open-book.png";
        displayBooks(bookTitle, author, bookCover);
      });
    })
    .catch((error) => {
      console.error(error);
    });
};

// function to display books
const displayBooks = function (title, author, cover) {
  const booksContainer = document.querySelector(".books-container");
  const bookElement = `
            <div class="book bg-slate-100 p-4 rounded-xl shadow hover:shadow-lg transition-all duration-300 cursor-pointer">
                
                <div class="flex flex-col items-center mt-4">
                    <img src="${cover}" alt="${title}" class="w-1/2 h-full object-cover rounded-lg shadow-md">

                    <h1 class="text-violet-900 font-extrabold text-xl md:text-2xl text-center">${title}</h1>
                    <p class="text-center">By <br><span class="text-lg text-red-400">${author}</span></p>
                </div>
            </div>
            `;
  booksContainer.insertAdjacentHTML("beforeend", bookElement);
};
