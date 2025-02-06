module.exports = (sequelize, DataTypes) => {
  const topic = sequelize.define(
    "topic",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      classId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "classModel",
          key: "id",
        },
      },
      value: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      tableName: "topics",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  topic.associate = (models) => {
    topic.belongsTo(models.classModel, { foreignKey: "classId" });
  };

  return topic;
};
