namespace MediaToAscii.Server.Common;

public interface ITempFileUtility
{
    Task<string> Persist(Stream stream, string extension, CancellationToken ct);

    string CreateDirectory();
}

public sealed class TempFileUtility : ITempFileUtility, IAsyncDisposable, IDisposable
{
    private readonly List<string> _paths = [];
    private readonly object _gate = new();
    private bool _disposed;

    public async Task<string> Persist(Stream stream, string extension, CancellationToken ct)
    {
        ObjectDisposedException.ThrowIf(_disposed, this);
        ArgumentNullException.ThrowIfNull(stream);

        var path = Path.Combine(Path.GetTempPath(), $"{Guid.NewGuid():N}{NormalizeExtension(extension)}");

        try
        {
            await using (var file = File.Create(path))
            {
                await stream.CopyToAsync(file, ct);
            }
        }
        catch
        {
            TryDelete(path);
            throw;
        }

        lock (_gate)
        {
            if (_disposed)
            {
                TryDelete(path);
                throw new ObjectDisposedException(nameof(TempFileUtility));
            }

            _paths.Add(path);
        }

        return path;
    }

    public string CreateDirectory()
    {
        ObjectDisposedException.ThrowIf(_disposed, this);

        var path = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString("N"));
        Directory.CreateDirectory(path);

        lock (_gate)
        {
            if (_disposed)
            {
                TryDelete(path);
                throw new ObjectDisposedException(nameof(TempFileUtility));
            }

            _paths.Add(path);
        }

        return path;
    }

    public void Dispose()
    {
        lock (_gate)
        {
            if (_disposed)
            {
                return;
            }

            _disposed = true;
        }

        DeleteAll();
        GC.SuppressFinalize(this);
    }

    public ValueTask DisposeAsync()
    {
        Dispose();
        return ValueTask.CompletedTask;
    }

    private void DeleteAll()
    {
        string[] paths;
        lock (_gate)
        {
            paths = _paths.ToArray();
            _paths.Clear();
        }

        foreach (var path in paths)
        {
            TryDelete(path);
        }
    }

    private static void TryDelete(string path)
    {
        try
        {
            if (Directory.Exists(path))
            {
                Directory.Delete(path, recursive: true);
            }
            else if (File.Exists(path))
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

    private static string NormalizeExtension(string? extension)
    {
        if (string.IsNullOrWhiteSpace(extension))
        {
            return string.Empty;
        }

        return extension.StartsWith('.') ? extension : $".{extension}";
    }
}
