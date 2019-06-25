const express = require("express");

const server = express();

//Permite que o express receba json na requisição
server.use(express.json());

//Middleware global que da log no número de requisições
function logNumberOfRequests(req, res, next) {
  numberOfRequests++;

  console.log(numberOfRequests);

  next();
}

server.use(logNumberOfRequests);

//Middleware para verificar se o projeto existe
function verifyProjectExist(req, res, next) {
  const { id } = req.params;
  const project = projects.find(x => x.id == id);

  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }

  return next();
}

//Número de requisições efetuadas
let numberOfRequests = 0;

//Lista de projetos
const projects = [
  {
    id: 1,
    title: "Projeto 01",
    tasks: []
  },
  {
    id: 2,
    title: "Projeto 02",
    tasks: []
  },
  {
    id: 3,
    title: "Projeto 03",
    tasks: []
  }
];

//Retorna todos os projetos
server.get("/projects", (req, res) => {
  return res.json(projects);
});

//Cria um novo projeto
server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(project);
});

//Altera um projeto
server.put("/projects/:id", verifyProjectExist, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  project = projects.find(x => x.id == id);

  project.title = title;

  return res.json(project);
});

//Deleta um projeto
server.delete("/projects/:id", verifyProjectExist, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(x => x.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
});

//Adiciona tarefas a um projeto
server.post("/projects/:id/tasks", verifyProjectExist, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(x => x.id == id);

  project.tasks.push(title);

  return res.json(project);
});

server.listen("3000");
