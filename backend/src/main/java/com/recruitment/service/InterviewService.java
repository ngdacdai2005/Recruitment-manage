package com.recruitment.service;

import com.recruitment.dto.request.EvaluationRequest;
import com.recruitment.dto.request.ScheduleInterviewRequest;
import com.recruitment.entity.Application;
import com.recruitment.entity.Interview;
import com.recruitment.entity.InterviewEvaluation;
import com.recruitment.entity.User;
import com.recruitment.exception.AppException;
import com.recruitment.repository.ApplicationRepository;
import com.recruitment.repository.InterviewEvaluationRepository;
import com.recruitment.repository.InterviewRepository;
import com.recruitment.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final InterviewEvaluationRepository evaluationRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    @Transactional
    public Interview scheduleInterview(ScheduleInterviewRequest req) {
        Application app = applicationRepository.findById(req.getApplicationId())
                .orElseThrow(() -> new AppException("Đơn ứng tuyển không tồn tại", HttpStatus.NOT_FOUND));

        User interviewer = userRepository.findById(req.getInterviewerId())
                .orElseThrow(() -> new AppException("Interviewer không tồn tại", HttpStatus.NOT_FOUND));

        Interview interview = Interview.builder()
                .application(app)
                .interviewer(interviewer)
                .scheduledAt(req.getScheduledAt())
                .durationMinutes(req.getDurationMinutes() != null ? req.getDurationMinutes() : 60)
                .interviewType(req.getInterviewType() != null ? req.getInterviewType() : "ONLINE")
                .locationOrLink(req.getLocationOrLink())
                .notes(req.getNotes())
                .status("SCHEDULED")
                .build();

        return interviewRepository.save(interview);
    }

    public List<Interview> getAdminInterviews(Long interviewerId) {
        if (interviewerId != null) {
            return interviewRepository.findByInterviewerIdOrderByScheduledAtDesc(interviewerId);
        }
        return interviewRepository.findAllByOrderByScheduledAtDesc();
    }

    public List<Interview> getCandidateInterviews(Long candidateUserId) {
        return interviewRepository.findByCandidateUserId(candidateUserId);
    }

    @Transactional
    public InterviewEvaluation evaluateInterview(Long interviewId, EvaluationRequest req, User evaluator) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new AppException("Lịch phỏng vấn không tồn tại", HttpStatus.NOT_FOUND));

        InterviewEvaluation eval = evaluationRepository.findByInterviewId(interviewId)
                .orElse(InterviewEvaluation.builder().interview(interview).build());

        eval.setTechnicalScore(req.getTechnicalScore());
        eval.setCommunicationScore(req.getCommunicationScore());
        eval.setProblemSolvingScore(req.getProblemSolvingScore());
        eval.setTeamworkScore(req.getTeamworkScore());
        eval.setGeneralNotes(req.getGeneralNotes());
        eval.setResult(req.getResult() != null ? req.getResult() : "PENDING");
        eval.setSubmittedBy(evaluator);

        InterviewEvaluation saved = evaluationRepository.save(eval);

        if ("PASS".equalsIgnoreCase(req.getResult()) || "FAIL".equalsIgnoreCase(req.getResult())) {
            interview.setStatus("COMPLETED");
            interviewRepository.save(interview);
        }

        return saved;
    }
}

