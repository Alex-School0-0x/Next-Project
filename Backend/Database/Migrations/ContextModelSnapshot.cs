﻿// <auto-generated />
using System;
using Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Database.Migrations
{
    [DbContext(typeof(Context))]
    partial class ContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("Database.Models.ActiveQuestionnaireModel", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("ActivatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetime2")
                        .HasDefaultValueSql("getdate()");

                    b.Property<Guid>("QuestionnaireTemplateFK")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime?>("StudentCompletedAt")
                        .HasColumnType("datetime2");

                    b.Property<int>("StudentFK")
                        .HasColumnType("int");

                    b.Property<DateTime?>("TeacherCompletedAt")
                        .HasColumnType("datetime2");

                    b.Property<int>("TeacherFK")
                        .HasColumnType("int");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("QuestionnaireTemplateFK");

                    b.HasIndex("StudentFK");

                    b.HasIndex("TeacherFK");

                    b.HasIndex("Title");

                    b.ToTable("ActiveQuestionnaire");
                });

            modelBuilder.Entity("Database.Models.ActiveQuestionnaireOptionModel", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("ActiveQuestionnaireQuestionFK")
                        .HasColumnType("int");

                    b.Property<string>("DisplayText")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("OptionValue")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("ActiveQuestionnaireQuestionFK");

                    b.ToTable("ActiveQuestionnaireOption");
                });

            modelBuilder.Entity("Database.Models.ActiveQuestionnaireQuestionModel", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<Guid>("ActiveQuestionnaireFK")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Prompt")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("ActiveQuestionnaireFK");

                    b.ToTable("ActiveQuestionnaireQuestion");
                });

            modelBuilder.Entity("Database.Models.ActiveQuestionnaireResponseModel", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<Guid>("ActiveQuestionnaireFK")
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("ActiveQuestionnaireQuestionFK")
                        .HasColumnType("int");

                    b.Property<int?>("CustomStudentResponseFK")
                        .HasColumnType("int");

                    b.Property<int?>("CustomTeacherResponseFK")
                        .HasColumnType("int");

                    b.Property<string>("StudentResponse")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("TeacherResponse")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("ActiveQuestionnaireFK");

                    b.HasIndex("ActiveQuestionnaireQuestionFK");

                    b.HasIndex("CustomStudentResponseFK")
                        .IsUnique()
                        .HasFilter("[CustomStudentResponseFK] IS NOT NULL");

                    b.HasIndex("CustomTeacherResponseFK")
                        .IsUnique()
                        .HasFilter("[CustomTeacherResponseFK] IS NOT NULL");

                    b.ToTable("ActiveQuestionnaireResponse");
                });

            modelBuilder.Entity("Database.Models.ApplicationLogsModel", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Category")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("EventId")
                        .HasColumnType("int");

                    b.Property<string>("Exception")
                        .HasMaxLength(5000)
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("LogLevel")
                        .HasColumnType("int");

                    b.Property<string>("Message")
                        .IsRequired()
                        .HasMaxLength(1000)
                        .HasColumnType("nvarchar(1000)");

                    b.Property<DateTime>("Timestamp")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetime2")
                        .HasDefaultValueSql("getdate()");

                    b.HasKey("Id");

                    b.ToTable("ApplicationLogs");
                });

            modelBuilder.Entity("Database.Models.CustomAnswerModelBase", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Discriminator")
                        .IsRequired()
                        .HasMaxLength(34)
                        .HasColumnType("nvarchar(34)");

                    b.Property<string>("Response")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("CustomAnswer");

                    b.HasDiscriminator().HasValue("CustomAnswerModelBase");

                    b.UseTphMappingStrategy();
                });

            modelBuilder.Entity("Database.Models.QuestionnaireOptionModel", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("DisplayText")
                        .IsRequired()
                        .HasMaxLength(250)
                        .HasColumnType("nvarchar(250)");

                    b.Property<int>("OptionValue")
                        .HasColumnType("int");

                    b.Property<int>("QuestionFK")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("QuestionFK");

                    b.ToTable("QuestionnaireTemplateOption");
                });

            modelBuilder.Entity("Database.Models.QuestionnaireQuestionModel", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<bool>("AllowCustom")
                        .HasColumnType("bit");

                    b.Property<string>("Prompt")
                        .IsRequired()
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");

                    b.Property<Guid>("QuestionnaireTemplateFK")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    b.HasIndex("QuestionnaireTemplateFK");

                    b.ToTable("QuestionnaireTemplateQuestion");
                });

            modelBuilder.Entity("Database.Models.QuestionnaireTemplateModel", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetime2")
                        .HasDefaultValueSql("getdate()");

                    b.Property<bool>("IsLocked")
                        .HasColumnType("bit");

                    b.Property<DateTime>("LastUpated")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetime2")
                        .HasDefaultValueSql("getdate()");

                    b.Property<string>("TemplateTitle")
                        .IsRequired()
                        .HasMaxLength(150)
                        .HasColumnType("nvarchar(150)");

                    b.HasKey("Id");

                    b.HasIndex("TemplateTitle")
                        .IsUnique();

                    b.HasIndex("CreatedAt", "Id")
                        .IsDescending(true, false);

                    b.HasIndex("TemplateTitle", "Id")
                        .IsDescending(true, false);

                    b.ToTable("QuestionnaireTemplate");
                });

            modelBuilder.Entity("Database.Models.TrackedRefreshTokenModel", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("CreatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetime2")
                        .HasDefaultValueSql("getdate()");

                    b.Property<bool>("IsRevoked")
                        .HasColumnType("bit");

                    b.Property<byte[]>("Token")
                        .IsRequired()
                        .HasColumnType("varbinary(900)");

                    b.Property<int?>("UserBaseModelId")
                        .HasColumnType("int");

                    b.Property<Guid>("UserGuid")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    b.HasIndex("Token");

                    b.HasIndex("UserBaseModelId");

                    b.ToTable("TrackedRefreshToken");
                });

            modelBuilder.Entity("Database.Models.UserBaseModel", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Discriminator")
                        .IsRequired()
                        .HasMaxLength(13)
                        .HasColumnType("nvarchar(13)");

                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<Guid>("Guid")
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("Permissions")
                        .HasColumnType("int");

                    b.Property<string>("PrimaryRole")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.HasKey("Id");

                    b.HasIndex("UserName")
                        .IsUnique();

                    b.ToTable("User");

                    b.HasDiscriminator().HasValue("UserBaseModel");

                    b.UseTphMappingStrategy();
                });

            modelBuilder.Entity("Database.Models.StudentCustomAnswerModel", b =>
                {
                    b.HasBaseType("Database.Models.CustomAnswerModelBase");

                    b.ToTable("CustomAnswer");

                    b.HasDiscriminator().HasValue("StudentCustomAnswerModel");
                });

            modelBuilder.Entity("Database.Models.TeacherCustomAnswerModel", b =>
                {
                    b.HasBaseType("Database.Models.CustomAnswerModelBase");

                    b.ToTable("CustomAnswer");

                    b.HasDiscriminator().HasValue("TeacherCustomAnswerModel");
                });

            modelBuilder.Entity("Database.Models.StudentModel", b =>
                {
                    b.HasBaseType("Database.Models.UserBaseModel");

                    b.ToTable("User");

                    b.HasDiscriminator().HasValue("StudentModel");
                });

            modelBuilder.Entity("Database.Models.TeacherModel", b =>
                {
                    b.HasBaseType("Database.Models.UserBaseModel");

                    b.ToTable("User");

                    b.HasDiscriminator().HasValue("TeacherModel");
                });

            modelBuilder.Entity("Database.Models.ActiveQuestionnaireModel", b =>
                {
                    b.HasOne("Database.Models.QuestionnaireTemplateModel", "QuestionnaireTemplate")
                        .WithMany("ActiveQuestionnaires")
                        .HasForeignKey("QuestionnaireTemplateFK")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("Database.Models.StudentModel", "Student")
                        .WithMany("ActiveQuestionnaires")
                        .HasForeignKey("StudentFK")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("Database.Models.TeacherModel", "Teacher")
                        .WithMany("ActiveQuestionnaires")
                        .HasForeignKey("TeacherFK")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("QuestionnaireTemplate");

                    b.Navigation("Student");

                    b.Navigation("Teacher");
                });

            modelBuilder.Entity("Database.Models.ActiveQuestionnaireOptionModel", b =>
                {
                    b.HasOne("Database.Models.ActiveQuestionnaireQuestionModel", "ActiveQuestionnaireQuestion")
                        .WithMany("ActiveQuestionnaireOptions")
                        .HasForeignKey("ActiveQuestionnaireQuestionFK")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("ActiveQuestionnaireQuestion");
                });

            modelBuilder.Entity("Database.Models.ActiveQuestionnaireQuestionModel", b =>
                {
                    b.HasOne("Database.Models.ActiveQuestionnaireModel", "ActiveQuestionnaire")
                        .WithMany("ActiveQuestionnaireQuestions")
                        .HasForeignKey("ActiveQuestionnaireFK")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("ActiveQuestionnaire");
                });

            modelBuilder.Entity("Database.Models.ActiveQuestionnaireResponseModel", b =>
                {
                    b.HasOne("Database.Models.ActiveQuestionnaireModel", "ActiveQuestionnaire")
                        .WithMany("Answers")
                        .HasForeignKey("ActiveQuestionnaireFK")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("Database.Models.ActiveQuestionnaireQuestionModel", "ActiveQuestionnaireQuestion")
                        .WithMany()
                        .HasForeignKey("ActiveQuestionnaireQuestionFK")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Database.Models.StudentCustomAnswerModel", "CustomStudentResponse")
                        .WithOne("ActiveQuestionnaireResponse")
                        .HasForeignKey("Database.Models.ActiveQuestionnaireResponseModel", "CustomStudentResponseFK");

                    b.HasOne("Database.Models.TeacherCustomAnswerModel", "CustomTeacherResponse")
                        .WithOne("ActiveQuestionnaireResponse")
                        .HasForeignKey("Database.Models.ActiveQuestionnaireResponseModel", "CustomTeacherResponseFK");

                    b.Navigation("ActiveQuestionnaire");

                    b.Navigation("ActiveQuestionnaireQuestion");

                    b.Navigation("CustomStudentResponse");

                    b.Navigation("CustomTeacherResponse");
                });

            modelBuilder.Entity("Database.Models.QuestionnaireOptionModel", b =>
                {
                    b.HasOne("Database.Models.QuestionnaireQuestionModel", "Question")
                        .WithMany("Options")
                        .HasForeignKey("QuestionFK")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Question");
                });

            modelBuilder.Entity("Database.Models.QuestionnaireQuestionModel", b =>
                {
                    b.HasOne("Database.Models.QuestionnaireTemplateModel", "QuestionnaireTemplate")
                        .WithMany("Questions")
                        .HasForeignKey("QuestionnaireTemplateFK")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("QuestionnaireTemplate");
                });

            modelBuilder.Entity("Database.Models.TrackedRefreshTokenModel", b =>
                {
                    b.HasOne("Database.Models.UserBaseModel", null)
                        .WithMany("TrackedRefreshTokens")
                        .HasForeignKey("UserBaseModelId");
                });

            modelBuilder.Entity("Database.Models.ActiveQuestionnaireModel", b =>
                {
                    b.Navigation("ActiveQuestionnaireQuestions");

                    b.Navigation("Answers");
                });

            modelBuilder.Entity("Database.Models.ActiveQuestionnaireQuestionModel", b =>
                {
                    b.Navigation("ActiveQuestionnaireOptions");
                });

            modelBuilder.Entity("Database.Models.QuestionnaireQuestionModel", b =>
                {
                    b.Navigation("Options");
                });

            modelBuilder.Entity("Database.Models.QuestionnaireTemplateModel", b =>
                {
                    b.Navigation("ActiveQuestionnaires");

                    b.Navigation("Questions");
                });

            modelBuilder.Entity("Database.Models.UserBaseModel", b =>
                {
                    b.Navigation("TrackedRefreshTokens");
                });

            modelBuilder.Entity("Database.Models.StudentCustomAnswerModel", b =>
                {
                    b.Navigation("ActiveQuestionnaireResponse");
                });

            modelBuilder.Entity("Database.Models.TeacherCustomAnswerModel", b =>
                {
                    b.Navigation("ActiveQuestionnaireResponse");
                });

            modelBuilder.Entity("Database.Models.StudentModel", b =>
                {
                    b.Navigation("ActiveQuestionnaires");
                });

            modelBuilder.Entity("Database.Models.TeacherModel", b =>
                {
                    b.Navigation("ActiveQuestionnaires");
                });
#pragma warning restore 612, 618
        }
    }
}
