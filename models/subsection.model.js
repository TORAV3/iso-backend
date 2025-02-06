module.exports = (sequelize, DataTypes) => {
  const subsection = sequelize.define(
    "subsection",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      sectionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "section",
          key: "id",
        },
      },
      value: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      materi: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      video: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      tableName: "subsections",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  subsection.associate = (models) => {
    subsection.belongsTo(models.section, { foreignKey: "sectionId" });
  };

  return subsection;
};
