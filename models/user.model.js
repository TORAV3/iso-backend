module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      fullname: {
        type: DataTypes.STRING(60),
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING(60),
        allowNull: false,
        unique: true,
      },
      phone: {
        type: DataTypes.STRING(14),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      tnc: {
        type: DataTypes.STRING(1),
        allowNull: false,
        defaultValue: "1",
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: "register",
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "role",
          key: "id",
        },
      },
      type: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      activeStatus: {
        type: DataTypes.STRING(1),
        allowNull: true,
        defaultValue: "1",
      },
    },
    {
      tableName: "users",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  user.associate = (models) => {
    user.hasOne(models.userDetail, { foreignKey: "userId" });
    user.belongsTo(models.role, { foreignKey: "roleId" });
    user.hasOne(models.access, { foreignKey: "userId" });
  };

  return user;
};
