FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src

# Copy csproj and restore as distinct layers
COPY ["skyora1.csproj", "./"]
RUN dotnet restore "./skyora1.csproj"

# Copy everything and publish
COPY . .
RUN dotnet publish "skyora1.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS runtime
WORKDIR /app

# Copy published app
COPY --from=build /app/publish .

# Expose the default HTTP port. The container entrypoint will set ASPNETCORE_URLS
EXPOSE 80

# At runtime set ASPNETCORE_URLS to use the PORT env var (Render provides `PORT`).
# Use a shell entrypoint so the value is expanded when the container starts.
ENTRYPOINT ["sh", "-c", "export ASPNETCORE_URLS=http://+:${PORT:-80} && exec dotnet skyora1.dll"]
