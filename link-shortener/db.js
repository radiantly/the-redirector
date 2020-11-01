const Sequelize = require('sequelize-cockroachdb');
const fs = require('fs');

// Connect to CockroachDB through Sequelize.
const sequelize = new Sequelize('bank', 'maxroach', '', {
    dialect: 'postgres',
    port: 26257,
    logging: console.log,
    dialectOptions: {
        ssl: {
            ca: fs.readFileSync('../../certs/ca.crt')
                .toString(),
            key: fs.readFileSync('../../certs/client.maxroach.key')
                .toString(),
            cert: fs.readFileSync('../../certs/client.maxroach.crt')
                .toString()
        }
    }
});

const Links = sequelize.define('links', {
    linkName: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    linkUrl: {
        type: Sequelize.STRING
    },
    linkText: {
        type: Sequelize.STRING
    },
    linkDescription: {
        type: Sequelize.STRING
    },
    linkImageUrl: {
        type: Sequelize.STRING
    }
});

Links
    .sync({ force: true })
    .then(() => {
        console.info("Database initialized!");
    });

module.exports = Links;
