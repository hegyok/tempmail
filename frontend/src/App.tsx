import { useState, useEffect } from 'react';
import { Copy, Mail, Loader2, RefreshCw } from 'lucide-react';

interface Email {
  id: string;
  subject: string;
  body: string;
  text: string;
  from: string;
  to: string;
  created_at: number;
}

function App() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  
  const [emailAddress, setEmailAddress] = useState<string>('')

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://tempmail.hegy.workers.dev/?email=${emailAddress}`);
      const data = await response.json();
      setEmails(data);
    } catch (error) {
      console.error('Error fetching emails:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const id = crypto.randomUUID()
    setEmailAddress(`${id}@t.hegy.xyz`)
  }, []);

  useEffect(() => {
    if (emailAddress) {
      fetchEmails();
      const interval = setInterval(() => fetchEmails(), 10000);
      return () => clearInterval(interval);
    }
  }, [emailAddress]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(emailAddress);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8 border-b pb-4">
          <div className="flex items-center gap-2">
            <Mail className="w-6 h-6" />
            <h1 className="text-2xl font-bold">Temporary Mail</h1>
          </div>
          <button
            onClick={fetchEmails}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-8 p-4 border rounded-lg bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="font-mono text-lg">{emailAddress}</p>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-100 transition-colors"
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {emails.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No emails received yet. Waiting for new messages...
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4">
                  {emails.map((email) => (
                    <div
                      key={email.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedEmail?.id === email.id ? 'bg-gray-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedEmail(email)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h2 className="font-semibold">{email.subject || '(No subject)'}</h2>
                        <span className="text-sm text-gray-500">
                          {formatDate(email.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">From: {email.from}</p>
                    </div>
                  ))}
                </div>

                {selectedEmail && (
                  <div className="border rounded-lg p-6 mt-4">
                    <h3 className="text-xl font-semibold mb-4">{selectedEmail.subject}</h3>
                    <div className="text-sm text-gray-600 mb-4">
                      <p>From: {selectedEmail.from}</p>
                      <p>Date: {formatDate(selectedEmail.created_at)}</p>
                    </div>
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: selectedEmail.body || selectedEmail.text
                      }}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;