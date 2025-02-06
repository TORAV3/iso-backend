module.exports = (sequelize, DataTypes) => {
  const soal = sequelize.define(
    "soal",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      testId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "test",
          key: "id",
        },
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "soals",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  soal.associate = (models) => {
    soal.belongsTo(models.test, { foreignKey: "testId" });
    soal.hasMany(models.jawaban, { foreignKey: "soalId" });
    soal.hasMany(models.jawabanBenar, { foreignKey: "soalId" });
  };

  return soal;
};
