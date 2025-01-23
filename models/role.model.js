module.exports = (sequelize, DataTypes) => {
  const role = sequelize.define(
    "role",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "roles",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  role.associate = (models) => {
    role.hasMany(models.user, { foreignKey: "roleId" });
  };

  return role;
};
