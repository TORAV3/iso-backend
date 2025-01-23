module.exports = (sequelize, DataTypes) => {
  const access = sequelize.define(
    "access",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
      },
      muser: {
        type: DataTypes.STRING(1),
        allowNull: true,
        defaultValue: "0",
      },
      usaccess: {
        type: DataTypes.STRING(1),
        allowNull: true,
        defaultValue: "0",
      },
    },
    {
      tableName: "accesses",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  access.associate = (models) => {
    access.belongsTo(models.user, { foreignKey: "userId" });
  };

  return access;
};
