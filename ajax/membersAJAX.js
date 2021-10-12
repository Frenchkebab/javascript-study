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

const membersCreate = function (form) {
  const memberNameObject = form['member-name'];
  const memberAgeObject = form['member-age'];
  const member = {
    name: memberNameObject.value,
    age: memberAgeObject.value
  };
  const successFunction = function () {
    memberNameObject.value = '';
    memberAgeObject.value = '';
    membersRead();
  };
  const xhrObject = new XMLHttpRequest();
  xhrObject.onreadystatechange = function () {
    if (xhrObject.readyState !== 4) return;
    if (xhrObject.status === 200) {
      successFunction();
    } else {
      const error = {
        status: xhrObject.status,
        statusText: xhrObject.statusText,
        responseText: xhrObject.responseText
      };
      console.error(error);
    }
  };
  xhrObject.open('POST', 'http://localhost:3100/api/v1/members');
  xhrObject.setRequestHeader('Content-Type', 'application/json');
  xhrObject.send(JSON.stringify(member));
};

const membersRead = function () {
  const successFunction = function (xhrObject) {
    const membersLogical = JSON.parse(xhrObject.responseText);
    members = membersLogical.members;
    const tagDivParent = document.getElementById('tag-div-parent');
    const tagDivChild = document.getElementById('tag-div-child');
    tagDivParent.innerHTML = '';
    for (let index in members) {
      const newDivChild = tagDivChild.cloneNode(true);
      tagDivParent.appendChild(newDivChild);
      const membersNameObject = document.getElementsByName('members-name')[index];
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
  const xhrObject = new XMLHttpRequest();
  xhrObject.onreadystatechange = function () {
    if (xhrObject.readyState !== 4) return;
    if (xhrObject.status === 200) {
      successFunction(xhrObject);
    } else {
      const error = {
        status: xhrObject.status,
        statusText: xhrObject.statusText,
        responseText: xhrObject.responseText
      };
      console.error(error);
    }
  };
  xhrObject.open('GET', 'http://localhost:3100/api/v1/members');
  xhrObject.setRequestHeader('Content-Type', 'application/json');
  xhrObject.send();
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
  members[index] = { name: name, age: age };
  membersSet();
  return membersRead();
};

const membersSet = function () {
  const membersSet = JSON.stringify(members);
  sessionStorage.setItem('members', membersSet);
};

membersRead();
