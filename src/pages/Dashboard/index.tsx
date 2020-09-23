import React, { useState, useCallback, useEffect, useMemo  } from  'react';
import {isToday, format} from 'date-fns';
import ptBr from'date-fns/locale/pt-BR';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { Container, Header, HeaderContent, Profile, Content, Schedule, NextAppointment, Calendar, Section, Appointment} from './styles';

import logoImg from '../../assets/logo.svg';
import { FiClock, FiPower } from 'react-icons/fi';
import { useAuth } from '../../Hooks/authContext';
import api from '../../services/api';
import { ptBR } from 'date-fns/esm/locale';

interface MonthAvailability{

    day: number;
    available: boolean;
}

interface Appointment {
    day: string;
    date: string;
    user:{
        user: String;
        avatar_url:string;
    }
}

const Dashboard: React.FC = () => {

    const {signOut,user} = useAuth()

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [monthAvailability, setMonthAvailability] = useState<MonthAvailability[]>([]);
   

    const handleDateChange  = useCallback((day: Date, modifiers: DayModifiers) =>{

        if(modifiers.available){
            setSelectedDate(day);
        }

    },[]);

    const [Appointments, setAppointments] = useState<Appointment[]>([]);

    const handleMonthChange = useCallback(( month: Date)=>{

        setCurrentMonth(month);
    },[]);

    useEffect(() =>{

        api.get(`/providers/${user.id}/month-availability`,{
            params:{
                year:currentMonth.getFullYear(),
                month: currentMonth.getMonth() + 1,
            }
        }).then(response =>{
            setMonthAvailability(response.data);
        })
    }, [currentMonth, user.id]);

    const disableDays = useMemo(()=>{
        const dates = monthAvailability
        .filter(monthDay => monthDay.available === false)
        .map(monthDay =>{
            const year = currentMonth.getFullYear();
            const month = currentMonth.getMonth();

            return new Date(year, month, monthDay.day);
        });

        return dates;

    },[currentMonth, monthAvailability])

    const  selectedDateAsText = useMemo(()=>{

        return format(selectedDate, "'Data' dd 'de' MMMM",{
            locale: ptBR,
        })
    },[selectedDate])


    const  selectedWeekDay = useMemo(()=>{

        return format(selectedDate, 'cccc',{
            locale: ptBR,
        })
    },[selectedDate]);


    useEffect(()=>{
        api.get('/appointments/me',{
            params:{
                year: selectedDate.getFullYear(),
                month: selectedDate.getMonth(),
                day: selectedDate.getDate(),
            },
        }).then(response =>{
            setAppointments(response.data)
    })
    },[selectedDate])

    return (  
    
    <Container>
        <Header>
            <HeaderContent>
                <img src={logoImg} alt="Gobarber"/>
              <Profile>
               <img src={user.avatar_url} alt={user.name}/>

               <div>
                   <span>Bem-vindo, </span>
                        <strong>{user.name}</strong>
                   

               </div>

               </Profile>

               <button type="button" onClick={signOut}>
                   <FiPower/>
               </button>
            </HeaderContent>
        </Header>

        <Content>
            <Schedule>

                <h1>Horários agendados</h1>

                <p>
                    {isToday(selectedDate) && <span>Hoje</span>}
                    <span>{ selectedDateAsText}</span>
                    <span>{selectedWeekDay}</span>
                </p>

                <NextAppointment>
                    <strong>Atendimento a seguir</strong>
                    <div>
                        <img src="https://avatars2.githubusercontent.com/u/55212842?s=460&u=ecbe7088a4af22a0850a0db7b0bea5dd120ca68c&v=4"alt="Fagner Santiago"/>
                        <strong>Fagner Santiago</strong>
                        <span>
                            <FiClock/>
                        </span>
                    </div>
                </NextAppointment>
                <Section>
                    <strong>Manhã</strong>

                    <Appointment>
                        <span>
                            <FiClock/>
                            08:00
                        </span>
                        <div>
                            <img  src="https://avatars2.githubusercontent.com/u/55212842?s=460&u=ecbe7088a4af22a0850a0db7b0bea5dd120ca68c&v=4"alt="Fagner Santiago"/>
                  
                        <strong>Fagner Santiago</strong>
                  
                        </div>
                    </Appointment>
                    <strong>Tarde</strong>
                    <Appointment>
                        <span>
                            <FiClock/>
                            14:00
                        </span>
                        <div>
                            <img  src="https://avatars2.githubusercontent.com/u/55212842?s=460&u=ecbe7088a4af22a0850a0db7b0bea5dd120ca68c&v=4"alt="Fagner Santiago"/>
                  
                        <strong>Fagner Santiago</strong>
                  
                        </div>
                    </Appointment>
                </Section>
            </Schedule>
            <Calendar>
                <DayPicker
                
                weekdaysShort={['D','S', 'T','Q','Q','S','S']}
                fromMonth={new Date()}
                disabledDays={[{daysOfWeek:[0, 6]}, ...disableDays]}
                modifiers={{
                    available:{ daysOfWeek:[1, 2, 3,4,5]}
                }}
          
                onMonthChange={handleMonthChange}
                selectedDays={selectedDate}
                onDayClick={handleDateChange}
                months ={[
                    'Janeiro',
                    'Fevereiro',
                    'Março',
                    'Abril',
                    'Maio',
                    'Junho',
                    'Julho',
                    'Agosto',
                    'Setembro',
                    'Outubro',
                    'Novembro',
                    'Dezembro',
                ]}
                />
            </Calendar>
        </Content>
    </Container>
    )

}



export default Dashboard;