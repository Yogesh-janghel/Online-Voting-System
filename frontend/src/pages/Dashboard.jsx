import { useState, useEffect, useContext } from 'react';
import { pollAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle2, Clock } from 'lucide-react';

export default function Dashboard() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [votedOptionIds, setVotedOptionIds] = useState(new Set());
  const [votedPollIds, setVotedPollIds] = useState(new Set());
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pollsRes, votesRes] = await Promise.all([
        pollAPI.getAllPolls(),
        pollAPI.getUserVotes(user.id)
      ]);
      setPolls(pollsRes.data);
      setVotedOptionIds(new Set(votesRes.data.votedOptions || []));
      setVotedPollIds(new Set(votesRes.data.votedPolls || []));
    } catch (err) {
      setError('Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (pollId, optionId) => {
    if (votedPollIds.has(pollId)) {
      alert("You have already voted in this election.");
      return;
    }

    try {
      await pollAPI.vote(pollId, optionId, user.id);
      setVotedOptionIds(prev => new Set(prev).add(optionId));
      setVotedPollIds(prev => new Set(prev).add(pollId));
      const pollsRes = await pollAPI.getAllPolls();
      setPolls(pollsRes.data);
    } catch (err) {
      alert(typeof err.response?.data === 'string' && err.response.data.trim() !== '' ? err.response.data : 'Failed to vote.');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );
  
  if (error) return <div className="text-red-500 bg-red-50 p-4 rounded-lg border border-red-100">{error}</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Available Elections</h1>
        <p className="mt-2 text-gray-500">Cast your vote in active polls and make your voice heard.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {polls.map(poll => {
          const isVoted = votedPollIds.has(poll.id);
          const isEnded = new Date() > new Date(poll.endTime);
          
          return (
            <div key={poll.id} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 flex flex-col transition-shadow duration-200">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{poll.title}</h2>
                <p className="text-gray-600 mb-5 text-sm leading-relaxed">{poll.description}</p>
                
                <div className="mb-5 flex items-center text-xs font-medium px-3 py-1.5 bg-gray-50 rounded-md w-fit border border-gray-100">
                  <Clock className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                  <span className={isEnded ? "text-red-600" : "text-gray-600"}>
                    {isEnded ? "Ended on " : "Ends "}
                    {new Date(poll.endTime).toLocaleString(undefined, {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {poll.options.map(option => {
                  const isThisOptionVoted = votedOptionIds.has(option.id);
                  let btnClasses = 'w-full text-left px-5 py-3.5 rounded-xl border flex justify-between items-center transition-all duration-200 ';
                  
                  if (isThisOptionVoted) {
                    btnClasses += 'bg-green-50 border-green-400 text-green-800 shadow-sm cursor-not-allowed';
                  } else if (isVoted || isEnded) {
                    btnClasses += 'bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed';
                  } else {
                    btnClasses += 'bg-white border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 hover:shadow-sm cursor-pointer text-gray-700';
                  }

                  return (
                    <button
                      key={option.id}
                      disabled={isVoted || isEnded}
                      onClick={() => handleVote(poll.id, option.id)}
                      className={btnClasses}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{option.text}</span>
                        {isThisOptionVoted && (
                          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-bold bg-green-200 text-green-800">
                            Your Vote
                          </span>
                        )}
                      </div>
                      {(isVoted || isEnded) && (
                        <span className={`text-sm font-bold ${isThisOptionVoted ? 'text-green-700' : 'text-gray-500'}`}>
                          {option.votes}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              
              {isVoted && (
                <div className="mt-5 flex items-center justify-center text-green-600 text-sm font-semibold bg-green-50 py-2.5 rounded-lg border border-green-100">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Vote successfully recorded
                </div>
              )}
              {isEnded && !isVoted && (
                <div className="mt-5 text-center text-red-500 text-sm font-semibold bg-red-50 py-2.5 rounded-lg border border-red-100">
                  This election has ended
                </div>
              )}
            </div>
          );
        })}
        {polls.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center text-gray-500 py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <Vote className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-lg font-medium text-gray-900">No active elections</p>
            <p className="text-sm mt-1">Check back later for new polls.</p>
          </div>
        )}
      </div>
    </div>
  );
}