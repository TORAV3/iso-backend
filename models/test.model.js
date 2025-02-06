module.exports = (sequelize, DataTypes) => {
  const test = sequelize.define(
    "test",
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
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      desc: {
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
      tableName: "tests",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  test.associate = (models) => {
    test.belongsTo(models.classModel, { foreignKey: "classId" });
    test.hasMany(models.soal, { foreignKey: "testId" });
  };

  return test;
};
