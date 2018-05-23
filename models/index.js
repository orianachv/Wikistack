var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack', {
  logging: false,
});

var Page = db.define(
  'page',
  {
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    urlTitle: {
      type: Sequelize.STRING,
      allowNull: false,
      get() {
        return `/wiki/${this.getDataValue('urlTitle')}`;
      },
    },

    content: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM('open', 'closed'),
    },
    tag: {
      type: Sequelize.ARRAY(Sequelize.STRING),
    },
  },
  {
    hooks: {
      beforeValidate: (page, options) => {
        page.urlTitle = generateUrlTitle(page.title);
      },
    },
  },
);
var User = db.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
});
Page.belongsTo(User, { as: 'author' });
//para encontrar un tag
Page.findByTag = function(tagsArray) {
  Page.findAll({
    where: {
      tag: {
        $overlap: tagsArray,
      },
    },
  });
};

function generateUrlTitle(title) {
  if (title) {
    // Remueve todos los caracteres no-alfanuméricos
    // y hace a los espacios guiones bajos.
    return title.replace(/\s+/g, '_').replace(/\W/g, '');
  } else {
    // Generá de forma aleatoria un string de 5 caracteres
    return Math.random()
      .toString(36)
      .substring(2, 7);
  }
}

module.exports = {
  Page: Page,
  User: User,
};
