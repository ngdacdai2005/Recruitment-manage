package com.recruitment.mapper;

import com.recruitment.entity.Job;
import com.recruitment.entity.Department;
import com.recruitment.entity.User;
import org.springframework.stereotype.Component;

@Component
public class JobMapper {

    public Job toEntity(Job source, Department department, User createdBy, String slug) {
        if (source == null) return null;
        source.setDepartment(department);
        source.setCreatedBy(createdBy);
        source.setSlug(slug);
        return source;
    }
}

