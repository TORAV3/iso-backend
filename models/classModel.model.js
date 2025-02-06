module.exports = (sequelize, DataTypes) => {
  const classModel = sequelize.define(
    "classModel",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      thumbnail: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(80),
        allowNull: false,
        unique: true,
      },
      subtitle: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      mentorId: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      duration: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      level: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      month: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      format: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(1),
        allowNull: true,
        defaultValue: "1",
      },
    },
    {
      tableName: "classes",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  classModel.associate = (models) => {
    classModel.hasMany(models.topic, { foreignKey: "classId" });
    classModel.hasMany(models.section, { foreignKey: "classId" });
    classModel.hasMany(models.test, { foreignKey: "classId" });
  };

  return classModel;
};
