module.exports = (sequelize, DataTypes) => {
  const jawaban = sequelize.define(
    "jawaban",
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
      opsi: {
        type: DataTypes.STRING(1),
        allowNull: false,
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "jawabans",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  jawaban.associate = (models) => {
    jawaban.belongsTo(models.soal, { foreignKey: "soalId" });
  };

  return jawaban;
};
