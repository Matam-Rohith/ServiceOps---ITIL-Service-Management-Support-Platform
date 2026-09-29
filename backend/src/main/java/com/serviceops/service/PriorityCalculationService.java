package com.serviceops.service;

import com.serviceops.entity.Impact;
import com.serviceops.entity.Priority;
import com.serviceops.entity.Urgency;
import org.springframework.stereotype.Service;

/**
 * Deterministic ITIL Priority Matrix
 * Decouples caller subjectivity from system SLA severity.
 *
 * Impact x Urgency -> Priority
 * HIGH   x HIGH   -> P1 (Critical)
 * HIGH   x MEDIUM -> P2 (High)
 * MEDIUM x HIGH   -> P2 (High)
 * MEDIUM x MEDIUM -> P3 (Moderate)
 * LOW    x HIGH   -> P3 (Moderate)
 * HIGH   x LOW    -> P3 (Moderate)
 * MEDIUM x LOW    -> P4 (Low)
 * LOW    x MEDIUM -> P4 (Low)
 * LOW    x LOW    -> P4 (Low)
 */
@Service
public class PriorityCalculationService {

    public Priority calculatePriority(Impact impact, Urgency urgency) {
        if (impact == null || urgency == null) {
            return Priority.P4;
        }

        if (impact == Impact.HIGH && urgency == Urgency.HIGH) {
            return Priority.P1;
        }
        if ((impact == Impact.HIGH && urgency == Urgency.MEDIUM) ||
            (impact == Impact.MEDIUM && urgency == Urgency.HIGH)) {
            return Priority.P2;
        }
        if ((impact == Impact.MEDIUM && urgency == Urgency.MEDIUM) ||
            (impact == Impact.LOW && urgency == Urgency.HIGH) ||
            (impact == Impact.HIGH && urgency == Urgency.LOW)) {
            return Priority.P3;
        }
        return Priority.P4;
    }
}
