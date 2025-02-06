module.exports = (sequelize, DataTypes) => {
  const section = sequelize.define(
    "section",
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
      tableName: "sections",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  section.associate = (models) => {
    section.belongsTo(models.classModel, { foreignKey: "classId" });
    section.hasMany(models.subsection, { foreignKey: "sectionId" });
  };

  return section;
};
