const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

function validateId(request, response, next) {
    const { id } = request.params;

    if (!isUuid(id)) {

        return response.status(400).json({ error: 'Id not found' });

    }
    console.log('antes do next');
    return next();
};

app.use(express.json());
app.use(cors());
app.use('/repositories/:id', validateId);


const repositories = [];

app.get("/repositories", (request, response) => {
    return response.json(repositories);
});

app.post("/repositories", (request, response) => {
    const { title, url, techs } = request.body;

    const repository = {
        id: uuid(),
        title,
        url,
        techs,
        likes: 0
    };

    repositories.push(repository);

    return response.json(repository);

});

app.put("/repositories/:id", (request, response) => {

    const { id } = request.params;
    const { title, url, techs } = request.body;

    const repositoryIndex = repositories.findIndex(repository => repository.id === id);

    console.log(repositoryIndex);

    if (repositoryIndex < 0) {
        return response.status(400).json({ error: 'Repository not found' });
    }

    const repository = {...repositories[repositoryIndex], title, url, techs }

    repositories[repositoryIndex] = repository;

    return response.json(repositories[repositoryIndex]);

});

app.delete("/repositories/:id", (request, response) => {
    const { id } = request.params;

    const repositoryIndex = repositories.findIndex(repository => repository.id === id);

    if (repositoryIndex < 0) {
        return response.status(400).json({ error: ' Repository not found' });
    };

    repositories.splice(repositoryIndex, 1);


    return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
    const { id } = request.params;

    const repositoryIndex = repositories.findIndex(repository => repository.id == id);

    if (repositoryIndex < 0) {
        return response.status(400).json({ error: 'Repository not found' });
    }
    console.log(id, repositoryIndex);

    const newLikeQuantity = repositories[repositoryIndex].likes + 1;
    const newRepository = {
        ...repositories[repositoryIndex],
        likes: newLikeQuantity
    }

    repositories[repositoryIndex] = newRepository;
    console.log(repositories[repositoryIndex]);
    return response.json(repositories[repositoryIndex]);
});

module.exports = app;