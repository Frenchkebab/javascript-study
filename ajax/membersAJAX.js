const queryString = new URLSearchParams(window.location.search);
const nameText = queryString.get('input-text');
const inputHiddens = queryString.getAll('input-hidden');
const inputHidden = inputHiddens[0];

// const inputTextObject = document.getElementsByName('input-text')[0];
// inputTextObject.value = nameText;
// inputTextObject.focus();
// inputTextObject.blur();

// const membersGet = sessionStorage.getItem('members');
// const membersLogical = membersGet || '[]';
// const members = JSON.parse(membersLogical);
let members;

// const membersSubmit = function (form) {
//   const inputTextObject = form['input-text'];
//   try {
//     const evalReturn = eval(inputTextObject.value);
//     console.log(evalReturn);
//   } catch (error) {
//     console.error(error);
//     alert(error);
//     return false;
//   }
// };

// const membersCreate = function (form) {
//   const memberNameObject = form['member-name'];
//   const memberAgeObject = form['member-age'];
//   members.push({
//     name: memberNameObject.value,
//     age: memberAgeObject.value
//   });
//   memberNameObject.value = '';
//   memberAgeObject.value = '';
//   membersSet();
//   return membersRead();
// };

const ajax = function (method, url, data, callback) {
  const xhrObject = new XMLHttpRequest();
  xhrObject.onreadystatechange = function () {
    if (xhrObject.readyState !== 4) return;
    if (xhrObject.status === 200) {
      callback(xhrObject); // 성공적으로 200 응답을 받은 경우
    } else {
      const error = {
        status: xhrObject.status,
        statusText: xhrObject.statusText,
        responseText: xhrObject.responseText
      };
      console.error(error);
    }
  };
  xhrObject.open(method, url);
  xhrObject.setRequestHeader('Content-Type', 'application/json'); // 질문
  xhrObject.send(data);
};

const membersCreate = function (form) {
  const memberNameObject = form['member-name'];
  const memberAgeObject = form['member-age'];

  // Create할 member 정보 객체
  const member = {
    name: memberNameObject.value,
    age: memberAgeObject.value
  };

  // 정상적으로 작동한 경우 동작할 함수
  const successFunction = function () {
    memberNameObject.value = '';
    memberAgeObject.value = '';
    membersRead();
  };

  ajax('POST', 'http://localhost:3100/api/v1/members', JSON.stringify(member), successFunction);
};

const membersRead = function () {
  // 200 응답을 받으면 호출할 함수
  const successFunction = function (xhrObject) {
    const membersLogical = JSON.parse(xhrObject.responseText);
    members = membersLogical.members;
    const tagDivParent = document.getElementById('tag-div-parent');
    const tagDivChild = document.getElementById('tag-div-child');
    tagDivParent.innerHTML = '';

    // 화면에 members 내부의 member 객체들을 표시
    for (let index in members) {
      const newDivChild = tagDivChild.cloneNode(true);
      tagDivParent.appendChild(newDivChild);
      const membersNameObject = document.getElementsByName('members-name')[index]; // 질문
      const membersAgeObject = document.getElementsByName('members-age')[index];
      const membersUpdateObject = document.getElementsByName('members-update')[index];
      const membersDeleteObject = document.getElementsByName('members-delete')[index];
      membersNameObject.value = members[index].name;
      membersAgeObject.value = members[index].age;
      membersUpdateObject.index = index;
      membersDeleteObject.index = index;
    }
    console.log('Readed', members);
  };

  // const xhrObject = new XMLHttpRequest();
  // xhrObject.onreadystatechange = function () {
  //   if (xhrObject.readyState !== 4) return;
  //   if (xhrObject.status === 200) {
  //     successFunction(xhrObject);
  //   } else {
  //     const error = {
  //       status: xhrObject.status,
  //       statusText: xhrObject.statusText,
  //       responseText: xhrObject.responseText
  //     };
  //     console.error(error);
  //   }
  // };
  // xhrObject.open('GET', 'http://localhost:3100/api/v1/members');
  // xhrObject.setRequestHeader('Content-Type', 'application/json');
  // xhrObject.send();

  ajax('GET', 'http://localhost:3100/api/v1/members', undefined, successFunction);
};

const membersDelete = function (index) {
  const url = 'http://localhost:3100/api/v1/members/' + index;
  const xhrObject = new XMLHttpRequest();
  xhrObject.onreadystatechange = function () {
    if (xhrObject.readyState !== 4) return;
    if (xhrObject.status === 200) {
      membersRead();
    } else {
      const error = {
        status: xhrObject.status,
        statusText: xhrObject.statusText,
        responseText: xhrObject.responseText
      };
      console.error(error);
    }
  };
  xhrObject.open('DELETE', url);
  xhrObject.setRequestHeader('Content-Type', 'application/json');
  xhrObject.send();
};

const membersUpdate = function (index) {
  const name = document.getElementsByName('members-name')[index].value;
  const age = document.getElementsByName('members-age')[index].value;
  const url = 'http://localhost:3100/api/v1/members/' + index;
  const member = {
    name: name,
    age: age
  };
  const xhrObject = new XMLHttpRequest();
  xhrObject.onreadystatechange = function () {
    if (xhrObject.readyState !== 4) return;
    if (xhrObject.status === 200) {
      membersRead();
    } else {
      const error = {
        status: xhrObject.status,
        statusText: xhrObject.statusText,
        responseText: xhrObject.responseText
      };
      console.error(error);
    }
  };
  xhrObject.open('PATCH', url);
  xhrObject.setRequestHeader('Content-Type', 'application/json');
  xhrObject.send(JSON.stringify(member));
};

membersRead();
