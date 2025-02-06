module.exports = (sequelize, DataTypes) => {
  const userDetail = sequelize.define(
    "userDetail",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      trainbef: {
        type: DataTypes.STRING(1),
        allowNull: false,
      },
      nik: {
        type: DataTypes.STRING(16),
        allowNull: false,
        unique: true,
      },
      gender: {
        type: DataTypes.STRING(1),
        allowNull: false,
      },
      religion: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      birthplace: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
      birthdate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      weight: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      height: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      lastedu: {
        type: DataTypes.STRING(5),
        allowNull: false,
      },
      program: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      dadName: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      dadPhone: {
        type: DataTypes.STRING(14),
        allowNull: false,
      },
      dadAddress: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      dadName: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      dadPhone: {
        type: DataTypes.STRING(14),
        allowNull: false,
      },
      dadAddress: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      momName: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      momPhone: {
        type: DataTypes.STRING(14),
        allowNull: false,
      },
      momAddress: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      kinsmanName: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      kinsmanPhone: {
        type: DataTypes.STRING(14),
        allowNull: false,
      },
      kinsmanAddress: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      pasFoto: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      fullBodyFoto: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      ktp: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      kk: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      akta: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      ijazah: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      sks: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      vaksin: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      sertifikat: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
    },
    {
      tableName: "user_details",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  userDetail.associate = (models) => {
    userDetail.belongsTo(models.user, { foreignKey: "userId" });
  };

  return userDetail;
};
