// ID取得
const form = document.getElementById("wordForm");
const wordInput = document.getElementById("word");
const meaningInput = document.getElementById("meaning");
const memoInput = document.getElementById("memo");
const wordList = document.getElementById("wordList");
const searchInput = document.getElementById("search");

let words = [];
let editIndex = null;

// 🔹 ローカルストレージからデータを読み込む
window.addEventListener("DOMContentLoaded", () => {
  // ⭐️ 常に初期から始める
  localStorage.removeItem("myWords");
  const storedWords = localStorage.getItem("myWords");

  if (storedWords) {
    words = JSON.parse(storedWords);
    displayWords(words);
  } else {
    // 🔽 ここに初期データを入れる
    words = [
      { word: "apple", meaning: "りんご", memo: "果物の名前" },
      { word: "book", meaning: "本", memo: "よく使う単語" },
    ];
    saveToLocalStorage();
    displayWords(words);
  }
});
// 🔹 ローカルストレージにデータを保存する関数
function saveToLocalStorage() {
  localStorage.setItem("myWords", JSON.stringify(words));
}

// フォーム送信イベント
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const word = wordInput.value.trim();
  const meaning = meaningInput.value.trim();
  const memo = memoInput.value.trim();

  if (word && meaning) {
    if (editIndex !== null) {
      words[editIndex] = { word, meaning, memo };
      editIndex = null;
    } else {
      words.push({ word, meaning, memo });
    }

    displayWords(words);
    saveToLocalStorage(); // 🔸保存
    form.reset();
  }
});

// 検索欄入力時
searchInput.addEventListener("input", function () {
  const keyword = searchInput.value.toLowerCase();
  const filtered = words.filter((item) =>
    item.word.toLowerCase().includes(keyword)
  );
  displayWords(filtered);
});

// リスト表示
function displayWords(list) {
  wordList.innerHTML = "";
  list.forEach(({ word, meaning, memo }, index) => {
    const li = document.createElement("li");
    li.className = "word-item";
    li.innerHTML = `
      <strong>${word}</strong><br>
      意味：${meaning}<br>
      <small>${memo}</small><br>
      <button class="edit-btn">編集</button>
      <button class="delete-btn">削除</button>
    `;

    // 編集ボタン
    li.querySelector(".edit-btn").addEventListener("click", () => {
      wordInput.value = word;
      meaningInput.value = meaning;
      memoInput.value = memo;
      editIndex = index;
    });

    // 削除ボタン
    li.querySelector(".delete-btn").addEventListener("click", () => {
      words.splice(index, 1);
      displayWords(words);
      saveToLocalStorage(); // 🔸削除後に保存
    });

    wordList.appendChild(li);
  });
}
