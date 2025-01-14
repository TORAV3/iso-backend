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
      status: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: "register",
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
  };

  return user;
};
