'use strict';
{
  //htmlのelementオブジェクトを取得
  const startBtn = document.getElementById('startBtn');
  const title = document.getElementById('title');
  const genre = document.getElementById('genre');
  const difficulty = document.getElementById('difficulty');
  const question = document.getElementById('question');
  const answerDiv = document.getElementById('answerDiv');

  //カウントする変数
  let quizIndex = 0;
  let correctNum = 0;

  //開始ボタンの動作
  startBtn.addEventListener('click', () => {
    quizFunc();
    title.textContent = "取得中";
    question.textContent = "少々お待ちください";
    document.body.removeChild(startBtn);
  });

  //答えボタンを削除
  const deleteAnswerBtn = () => {
    while (answerDiv.firstChild) {
      answerDiv.removeChild(answerDiv.firstChild)
    }
  }

  //答えの配列を作成し、シャッフル
  const makeAnswerArray = (quiz) => {
    let answerArray = [];
    answerArray[0] = quiz.correct_answer;
    answerArray[1] = quiz.incorrect_answers[0];
    answerArray[2] = quiz.incorrect_answers[1];
    answerArray[3] = quiz.incorrect_answers[2];
    for (let i = answerArray.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [answerArray[j], answerArray[i]] = [answerArray[i], answerArray[j]];
    }
    return answerArray;
  }

  //答えのボタンを作りDOMに追加
  const makeAnswerBtn = (answer) => {
    const answerBtn = document.createElement('button');
    answerBtn.textContent = answer;
    answerDiv.appendChild(answerBtn);
    answerDiv.appendChild(document.createElement('br'));
    return answerBtn;
  }

  //スコアとホームに戻るボタンを表示
  const showScore = () => {
    title.textContent = `あなたの正解数は${correctNum}です！！`;
    question.textContent = "再度チャレンジしたい場合は以下をクリック！！";
    document.body.removeChild(genre);
    document.body.removeChild(difficulty);
    deleteAnswerBtn();
    const retryBtn = document.createElement('button');
    retryBtn.textContent = "ホームに戻る";
    answerDiv.appendChild(retryBtn);
    retryBtn.addEventListener('click', () => {
      location.reload();
    });
  }

  //問題を表示
  const showQuestion = (quizes) => {
    const quiz = quizes[quizIndex];
    title.textContent = `問題${quizIndex+1}`;
    genre.textContent = `【ジャンル】${quiz.category}`;
    difficulty.textContent = `【難易度】${quiz.difficulty}`;
    question.textContent = quiz.question;
    deleteAnswerBtn();

    //答えの配列を作り、ボタンで表示
    makeAnswerArray(quiz).forEach(answer => {
      makeAnswerBtn(answer).addEventListener('click', () => {
        quizIndex++;
        //正誤判定
        if (makeAnswerBtn(answer).textContent === quiz.correct_answer){
          correctNum++;
        }
        //10問目を答えたらスコアを表示
        if (quizIndex === 10) {
          showScore();
        } else {
          showQuestion(quizes);
        }
      });
    });
  }

  //APIからクイズ問題を取得
  const quizFunc = async() => {
    const res = await fetch('https://opentdb.com/api.php?amount=10&type=multiple');
    const resObj = await res.json();
    const quizes = resObj.results;
    showQuestion(quizes);
  }
}
