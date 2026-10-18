namespace MediaToAscii.Server.Common;

public interface ITempFileUtility
{
    Task<string> Persist(Stream stream, string extension, CancellationToken ct);

    string CreateDirectory();
}

public sealed class TempFileUtility : ITempFileUtility, IAsyncDisposable, IDisposable
{
    private readonly List<string> _files = [];
    private readonly List<string> _dirs = [];
    private readonly object _lock = new();

    public async Task<string> Persist(Stream stream, string extension, CancellationToken ct)
    {
        ArgumentNullException.ThrowIfNull(stream);

        var normalizedExtension = string.IsNullOrWhiteSpace(extension)
            ? string.Empty
            : extension.StartsWith('.') ? extension : $".{extension}";
        var path = Path.Combine(Path.GetTempPath(), $"{Guid.NewGuid():N}{normalizedExtension}");

        try
        {
            await using (var file = File.Create(path))
            {
                await stream.CopyToAsync(file, ct);
            }
        }
        catch
        {
            TryDeleteFile(path);
            throw;
        }

        lock (_lock)
        {
            _files.Add(path);
        }

        return path;
    }

    public string CreateDirectory()
    {
        var path = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString("N"));
        Directory.CreateDirectory(path);

        lock (_lock)
        {
            _dirs.Add(path);
        }

        return path;
    }

    public void Dispose()
    {
        string[] files;
        string[] dirs;

        lock (_lock)
        {
            files = _files.ToArray();
            dirs = _dirs.ToArray();
            _files.Clear();
            _dirs.Clear();
        }

        foreach (var file in files)
        {
            TryDeleteFile(file);
        }

        foreach (var dir in dirs)
        {
            TryDeleteDirectory(dir);
        }
    }

    public ValueTask DisposeAsync()
    {
        Dispose();
        return ValueTask.CompletedTask;
    }

    private static void TryDeleteFile(string path)
    {
        try
        {
            if (File.Exists(path))
            {
                File.Delete(path);
            }
        }
        catch (IOException)
        {
            // Best-effort cleanup; OS temp scavenges leftovers.
        }
        catch (UnauthorizedAccessException)
        {
            // Best-effort cleanup; OS temp scavenges leftovers.
        }
    }

    private static void TryDeleteDirectory(string path)
    {
        try
        {
            if (Directory.Exists(path))
            {
                Directory.Delete(path, recursive: true);
            }
        }
        catch (IOException)
        {
            // Best-effort cleanup; OS temp scavenges leftovers.
        }
        catch (UnauthorizedAccessException)
        {
            // Best-effort cleanup; OS temp scavenges leftovers.
        }
    }

}
