module.exports = (sequelize, DataTypes) => {
  const jawabanBenar = sequelize.define(
    "jawabanBenar",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      soalId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "soal",
          key: "id",
        },
      },
      value: {
        type: DataTypes.STRING(1),
        allowNull: false,
      },
    },
    {
      tableName: "jawaban_benars",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  jawabanBenar.associate = (models) => {
    jawabanBenar.belongsTo(models.soal, { foreignKey: "soalId" });
  };

  return jawabanBenar;
};
