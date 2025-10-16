import React from 'react';
import ChallengeCard from './ChallengeCard';

const ChallengeList = ({ challenges, onPlayChallenge }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {challenges.map((challenge, index) => (
        <ChallengeCard 
          key={index}
          challenge={challenge}
          onPlay={onPlayChallenge}
        />
      ))}
    </div>
  );
};

export default ChallengeList;