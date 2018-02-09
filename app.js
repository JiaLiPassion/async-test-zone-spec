window.onload = function() {
  const outputElem = document.getElementById('output');
  Zone.current
      .fork(new Zone['AsyncTestZoneSpec'](
          () => {
            outputElem.innerHTML +=
                '<span style="color:orange">Check: AsyncTestZoneSpec thinks everything is finished.</span><br>';

          },
          (error) => {
            console.log('Check: error ' + error);
          },
          'async test'))
      .fork({
        onHasTask(parent, current, target, hasTask) {
          if (hasTask.macroTask) {
            outputElem.innerHTML +=
                'Check: There are outstanding MacroTasks.<br>';
          } else {
            outputElem.innerHTML +=
                'Check: All MacroTasks have been completed.<br>';
          }

          if (hasTask.microTask) {
            outputElem.innerHTML +=
                'Check: There are outstanding MicroTasks.<br>';
          } else {
            outputElem.innerHTML +=
                'Check: All MicroTasks have been completed.<br>';
          }

          if (!hasTask.microTask && !hasTask.macroTask) {
            outputElem.innerHTML +=
                '<span style="color:red">Check: All tasks finished!</span>.<br>';
          }
        }
      })
      .run(function() {
        const attach = function() {
          return new Promise(function attached(resolve, reject) {
            const element = document.createElement('script');
            element.async = false;
            element.src = 'https://code.jquery.com/jquery-3.3.1.js';
            element.onload = function loaded() {
              resolve();
            };
            element.onerror = function loadError(error) {
              reject(error);
            };
            document.body.appendChild(element);
          });
        };
        new Promise(function resolver(resolve, reject) {
          setTimeout(() => {
            resolve();
          }, 1500);
        }).then(function thenHandle() {
          attach().then(
              function thenHandle() {
                outputElem.innerHTML += 'Check: Script loaded<br>';
              },
              function thenErrorHandle() {
                outputElem.innerHTML += 'Check: Script loading error<br>';
              });
        });

      });
}