const http = require('http');
const FormData = require('form-data');

const loginReq = http.request('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const parsed = JSON.parse(data);
    const token = parsed.token;
    console.log('Login status:', res.statusCode);
    
    if (token) {
      const projReq = http.request('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' }
      }, (res2) => {
        let data2 = '';
        res2.on('data', chunk => data2 += chunk);
        res2.on('end', () => {
          const project = JSON.parse(data2).project;
          console.log('Create Project status:', res2.statusCode);
          if (project) {
             const projectId = project._id;
             console.log('Project ID:', projectId);
             
             const form = new FormData();
             form.append('name', 'Test Resource');
             form.append('description', 'test desc');
             form.append('type', 'link');
             form.append('url', 'https://example.com');
             form.append('tags', JSON.stringify(['test']));
             
             const resReq = http.request('http://localhost:5000/api/projects/' + projectId + '/resources', {
               method: 'POST',
               headers: {
                 'Authorization': 'Bearer ' + token,
                 ...form.getHeaders()
               }
             }, (res3) => {
                let data3 = '';
                res3.on('data', chunk => data3 += chunk);
                res3.on('end', () => {
                  console.log('Add Resource status:', res3.statusCode);
                  console.log('Add Resource response:', data3);
                });
             });
             form.pipe(resReq);
          }
        });
      });
      projReq.write(JSON.stringify({ title: 'Test Project', description: 'test', researchArea: 'test' }));
      projReq.end();
    }
  });
});
loginReq.write(JSON.stringify({ email: 'test_user_1791292480665@example.com', password: 'password123' }));
loginReq.end();
